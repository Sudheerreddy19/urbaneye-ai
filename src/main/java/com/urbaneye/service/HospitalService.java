package com.urbaneye.service;

import com.urbaneye.dto.HospitalCapacityDTO;
import com.urbaneye.dto.IncomingEmergencyCaseDTO;
import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.Hospital;
import com.urbaneye.entity.HospitalBed;
import com.urbaneye.entity.enums.BedStatus;
import com.urbaneye.entity.enums.EmergencyStatus;
import com.urbaneye.entity.enums.SignalState;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.EmergencyRequestRepository;
import com.urbaneye.repository.HospitalBedRepository;
import com.urbaneye.repository.HospitalRepository;
import com.urbaneye.repository.TrafficSignalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class HospitalService {

    private static final Logger log = LoggerFactory.getLogger(HospitalService.class);
    private static final double AVERAGE_SPEED_KMH = 45.0;
    private static final int    EARTH_RADIUS_KM   = 6371;

    private final HospitalRepository         hospitalRepository;
    private final HospitalBedRepository      bedRepository;
    private final EmergencyRequestRepository emergencyRepository;
    private final TrafficSignalRepository    signalRepository;
    private final SimpMessagingTemplate      messagingTemplate;

    public HospitalService(HospitalRepository hospitalRepository,
                           HospitalBedRepository bedRepository,
                           EmergencyRequestRepository emergencyRepository,
                           TrafficSignalRepository signalRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.hospitalRepository  = hospitalRepository;
        this.bedRepository       = bedRepository;
        this.emergencyRepository = emergencyRepository;
        this.signalRepository    = signalRepository;
        this.messagingTemplate   = messagingTemplate;
    }

    public List<Hospital> getAll() { return hospitalRepository.findAll(); }

    public Hospital getById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", id));
    }

    public List<HospitalBed> getBedsByHospital(Long hospitalId) {
        return bedRepository.findByHospitalId(hospitalId);
    }

    @Transactional
    public HospitalBed updateBedStatus(Long bedId, BedStatus newStatus) {
        HospitalBed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new ResourceNotFoundException("HospitalBed", "id", bedId));
        bed.setStatus(newStatus);
        HospitalBed saved = bedRepository.save(bed);
        Hospital hospital = bed.getHospital();
        long available = bedRepository.countByHospitalIdAndStatus(hospital.getId(), BedStatus.AVAILABLE);
        hospital.setAvailableBeds((int) available);
        hospitalRepository.save(hospital);
        log.info("Bed {} status → {}", bedId, newStatus);
        return saved;
    }

    /**
     * Hospital Emergency Capacity overview (Step 5.4)
     */
    public HospitalCapacityDTO getCapacity(Long hospitalId) {
        Hospital h = getById(hospitalId);
        List<IncomingEmergencyCaseDTO> queue = getIncomingQueue(hospitalId);

        return HospitalCapacityDTO.builder()
                .hospitalId(h.getId())
                .hospitalName(h.getName())
                .totalBeds(h.getTotalBeds())
                .availableBeds(h.getAvailableBeds())
                .icuBeds(h.getIcuBeds())
                .availableIcuBeds(h.getAvailableIcuBeds())
                .bloodUnits(h.getBloodUnits() != null ? h.getBloodUnits() : 24)
                .emergencyDoctors(h.getEmergencyDoctors() != null ? h.getEmergencyDoctors() : 4)
                .emergencyRoomAvailable(h.getEmergencyRoomAvailable())
                .incomingAmbulancesCount(queue.size())
                .build();
    }

    @Transactional
    public HospitalCapacityDTO updateResources(Long hospitalId, Integer bloodUnits, Integer emergencyDoctors, Boolean erAvailable) {
        Hospital h = getById(hospitalId);
        if (bloodUnits != null) h.setBloodUnits(bloodUnits);
        if (emergencyDoctors != null) h.setEmergencyDoctors(emergencyDoctors);
        if (erAvailable != null) h.setEmergencyRoomAvailable(erAvailable);

        Hospital saved = hospitalRepository.save(h);
        return getCapacity(saved.getId());
    }

    /**
     * Incoming Emergency Ambulance Queue sorted by CRITICAL > HIGH > MEDIUM > LOW then ETA (Step 5.5)
     */
    public List<IncomingEmergencyCaseDTO> getIncomingQueue(Long hospitalId) {
        Hospital h = getById(hospitalId);
        List<EmergencyRequest> activeRequests = emergencyRepository.findByHospitalIdAndStatus(hospitalId, EmergencyStatus.EN_ROUTE);
        activeRequests.addAll(emergencyRepository.findByHospitalIdAndStatus(hospitalId, EmergencyStatus.ACCEPTED));
        activeRequests.addAll(emergencyRepository.findByHospitalIdAndStatus(hospitalId, EmergencyStatus.HOSPITAL_IN_TRANSIT));

        List<IncomingEmergencyCaseDTO> queue = new ArrayList<>();

        for (EmergencyRequest req : activeRequests) {
            double dist = 0.0;
            int eta = 5;
            if (req.getAmbulance() != null && req.getAmbulance().getLatitude() != null) {
                dist = haversine(req.getAmbulance().getLatitude(), req.getAmbulance().getLongitude(), h.getLatitude(), h.getLongitude());
                eta = (int) Math.ceil((dist / AVERAGE_SPEED_KMH) * 60.0);
            }

            boolean isGreenCorridor = signalRepository.findByCurrentState(SignalState.FORCED_GREEN).stream()
                    .anyMatch(s -> req.getAmbulance() != null && req.getAmbulance().getAmbulanceNumber().equals(s.getForcedByAmbulance()));

            queue.add(IncomingEmergencyCaseDTO.builder()
                    .requestId(req.getId())
                    .ambulanceNumber(req.getAmbulance() != null ? req.getAmbulance().getAmbulanceNumber() : "AMB-101")
                    .driverName(req.getAmbulance() != null && req.getAmbulance().getDriver() != null ? req.getAmbulance().getDriver().getName() : "Ramesh Kumar")
                    .driverPhone(req.getAmbulance() != null && req.getAmbulance().getDriver() != null ? req.getAmbulance().getDriver().getPhone() : "+919876543220")
                    .patientName(req.getPatientName() != null ? req.getPatientName() : "Emergency Patient")
                    .severity(req.getSeverity().name())
                    .status(req.getStatus().name())
                    .etaMinutes(Math.max(1, eta))
                    .distanceKm(Math.round(dist * 10.0) / 10.0)
                    .greenCorridorActive(isGreenCorridor)
                    .currentSignalCode(isGreenCorridor ? "SIGNAL-02" : "SIGNAL-04")
                    .pickupLatitude(req.getPickupLatitude())
                    .pickupLongitude(req.getPickupLongitude())
                    .build());
        }

        // Sort: CRITICAL > HIGH > MEDIUM > LOW, then by ETA
        Map<String, Integer> severityWeight = Map.of("CRITICAL", 4, "HIGH", 3, "MEDIUM", 2, "LOW", 1);
        queue.sort((a, b) -> {
            int wA = severityWeight.getOrDefault(a.getSeverity(), 1);
            int wB = severityWeight.getOrDefault(b.getSeverity(), 1);
            if (wB != wA) return Integer.compare(wB, wA);
            return Integer.compare(a.getEtaMinutes(), b.getEtaMinutes());
        });

        return queue;
    }

    public void notifyIncomingAmbulance(Long hospitalId, Long requestId) {
        EmergencyRequest req = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyRequest", "id", requestId));
        Map<String, Object> alert = Map.of(
                "ambulanceNumber", req.getAmbulance().getAmbulanceNumber(),
                "patientName",     req.getPatientName() != null ? req.getPatientName() : "Unknown",
                "severity",        req.getSeverity().name(),
                "status",          req.getStatus().name(),
                "requestId",       requestId,
                "message",         "🚑 Ambulance incoming — prepare emergency room!"
        );
        messagingTemplate.convertAndSend("/topic/hospital/" + hospitalId, alert);
        log.info("Hospital {} notified of ambulance {}", hospitalId, req.getAmbulance().getAmbulanceNumber());
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}
