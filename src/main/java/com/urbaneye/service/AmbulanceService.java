package com.urbaneye.service;

import com.urbaneye.dto.AmbulanceDetailsDTO;
import com.urbaneye.dto.AmbulanceLocationDTO;
import com.urbaneye.dto.NearbyAmbulanceDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.enums.AmbulanceStatus;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.AmbulanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanceService {

    private static final Logger log             = LoggerFactory.getLogger(AmbulanceService.class);
    private static final double NEARBY_RADIUS_KM  = 10.0;
    private static final double AVERAGE_SPEED_KMH = 40.0;
    private static final int    EARTH_RADIUS_KM   = 6371;

    private final AmbulanceRepository  ambulanceRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final GreenCorridorService greenCorridorService;

    public AmbulanceService(AmbulanceRepository ambulanceRepository,
                            SimpMessagingTemplate messagingTemplate,
                            @Lazy GreenCorridorService greenCorridorService) {
        this.ambulanceRepository  = ambulanceRepository;
        this.messagingTemplate    = messagingTemplate;
        this.greenCorridorService = greenCorridorService;
    }

    // ── Basic Queries ─────────────────────────────────────────────────────────

    public List<Ambulance> getAll() { return ambulanceRepository.findAll(); }

    public Ambulance getByAmbulanceNumber(String number) {
        return ambulanceRepository.findByAmbulanceNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance", "number", number));
    }

    public Ambulance getById(Long id) {
        return ambulanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance", "id", id));
    }

    // ── Nearby Search ─────────────────────────────────────────────────────────

    public List<NearbyAmbulanceDTO> findNearby(double latitude, double longitude) {
        return ambulanceRepository
                .findNearbyAvailableAmbulances(latitude, longitude, NEARBY_RADIUS_KM)
                .stream()
                .map(a -> mapToNearbyDTO(a, latitude, longitude))
                .collect(Collectors.toList());
    }

    // ── Details (click-card) ──────────────────────────────────────────────────

    /**
     * Returns the full details for the ambulance info-card shown when a user clicks
     * an ambulance marker. Includes driver, hospital, computed distance & ETA.
     *
     * GET /api/ambulances/{number}/details?latitude=&longitude=
     */
    public AmbulanceDetailsDTO getDetails(String ambulanceNumber,
                                          double userLat,
                                          double userLon) {
        Ambulance a = getByAmbulanceNumber(ambulanceNumber);
        double dist = haversine(userLat, userLon, a.getLatitude(), a.getLongitude());
        int    eta  = (int) Math.ceil((dist / AVERAGE_SPEED_KMH) * 60);

        return AmbulanceDetailsDTO.builder()
                .ambulanceNumber(a.getAmbulanceNumber())
                .vehicleType(a.getAmbulanceType().name())
                .status(a.getStatus().name())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .speed(a.getSpeed())
                // driver
                .driverName(a.getDriver()  != null ? a.getDriver().getName()          : "N/A")
                .driverPhone(a.getDriver() != null ? a.getDriver().getPhone()          : "N/A")
                .licenseNumber(a.getDriver() != null ? a.getDriver().getLicenseNumber(): "N/A")
                .driverRating(a.getDriver() != null ? a.getDriver().getRating()        : null)
                // hospital
                .hospitalId(a.getHospital()   != null ? a.getHospital().getId()                    : null)
                .hospitalName(a.getHospital() != null ? a.getHospital().getName()                  : "N/A")
                .hospitalAddress(a.getHospital() != null ? a.getHospital().getAddress()            : "N/A")
                .hospitalPhone(a.getHospital() != null ? a.getHospital().getPhone()                : "N/A")
                .emergencyRoomAvailable(a.getHospital() != null
                        ? a.getHospital().getEmergencyRoomAvailable() : false)
                // calculated
                .distanceKm(Math.round(dist * 10.0) / 10.0)
                .etaMinutes(eta)
                .build();
    }

    // ── Location Update & Phase 4 Dynamic Green Corridor Preemption ───────────

    @Transactional
    public void updateLocation(AmbulanceLocationDTO dto) {
        Ambulance a = ambulanceRepository.findByAmbulanceNumber(dto.getAmbulanceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ambulance", "number", dto.getAmbulanceId()));

        a.setLatitude(dto.getLatitude());
        a.setLongitude(dto.getLongitude());
        if (dto.getSpeed()  != null) a.setSpeed(dto.getSpeed());
        if (dto.getStatus() != null) {
            try {
                a.setStatus(AmbulanceStatus.valueOf(dto.getStatus()));
            } catch (Exception ignored) {}
        }

        ambulanceRepository.save(a);
        dto.setTimestamp(System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/ambulances", dto);

        // 🚨 Phase 4: Dynamic 300m Geofencing & Signal Preemption
        if (a.getStatus() == AmbulanceStatus.EMERGENCY) {
            greenCorridorService.processAmbulanceMovement(
                    a.getAmbulanceNumber(),
                    a.getLatitude(),
                    a.getLongitude(),
                    a.getSpeed() != null ? a.getSpeed() : 40.0
            );
        }

        log.debug("Ambulance {} → [{}, {}] [{}]",
                dto.getAmbulanceId(), dto.getLatitude(), dto.getLongitude(), a.getStatus());
    }

    // ── Status Update ─────────────────────────────────────────────────────────

    @Transactional
    public Ambulance updateStatus(String number, AmbulanceStatus status) {
        Ambulance a = getByAmbulanceNumber(number);
        a.setStatus(status);
        Ambulance saved = ambulanceRepository.save(a);

        if (status == AmbulanceStatus.EMERGENCY) {
            greenCorridorService.activateGreenCorridor(number);
        } else if (status == AmbulanceStatus.AVAILABLE || status == AmbulanceStatus.OFFLINE) {
            greenCorridorService.deactivateGreenCorridor(number);
        }

        return saved;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private NearbyAmbulanceDTO mapToNearbyDTO(Ambulance a, double userLat, double userLon) {
        double dist = haversine(userLat, userLon, a.getLatitude(), a.getLongitude());
        int    eta  = (int) Math.ceil((dist / AVERAGE_SPEED_KMH) * 60);
        return NearbyAmbulanceDTO.builder()
                .ambulanceNumber(a.getAmbulanceNumber())
                .driverName(a.getDriver()  != null ? a.getDriver().getName()  : "N/A")
                .driverPhone(a.getDriver() != null ? a.getDriver().getPhone() : "N/A")
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .distance(Math.round(dist * 10.0) / 10.0)
                .eta(eta)
                .type(a.getAmbulanceType().name())
                .status(a.getStatus().name())
                .rating(a.getDriver() != null ? a.getDriver().getRating() : null)
                .build();
    }

    // ── Haversine ─────────────────────────────────────────────────────────────

    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}
