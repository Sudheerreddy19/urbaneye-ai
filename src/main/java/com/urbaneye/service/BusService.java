package com.urbaneye.service;

import com.urbaneye.dto.BusDetailsDTO;
import com.urbaneye.dto.BusLocationDTO;
import com.urbaneye.dto.OccupancyDTO;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.BusRoute;
import com.urbaneye.entity.BusStop;
import com.urbaneye.entity.enums.BusStatus;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.BusRepository;
import com.urbaneye.repository.BusRouteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BusService {

    private static final Logger log = LoggerFactory.getLogger(BusService.class);
    private static final double NEARBY_RADIUS_KM = 5.0;
    private static final double AVERAGE_BUS_SPEED_KMH = 30.0;
    private static final int    EARTH_RADIUS_KM = 6371;

    private final BusRepository        busRepository;
    private final BusRouteRepository   busRouteRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BusService(BusRepository busRepository,
                      BusRouteRepository busRouteRepository,
                      SimpMessagingTemplate messagingTemplate) {
        this.busRepository        = busRepository;
        this.busRouteRepository   = busRouteRepository;
        this.messagingTemplate    = messagingTemplate;
    }

    public List<Bus> getAll() { return busRepository.findAll(); }

    public Bus getByBusNumber(String busNumber) {
        return busRepository.findByBusNumber(busNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "number", busNumber));
    }

    public Bus getById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "id", id));
    }

    public List<Bus> findNearby(double latitude, double longitude) {
        return busRepository.findNearbyActiveBuses(latitude, longitude, NEARBY_RADIUS_KM);
    }

    public List<Bus> getBusesByRoute(String routeNumber) {
        return busRepository.findByBusRouteRouteNumber(routeNumber);
    }

    public OccupancyDTO getOccupancy(String busNumber) {
        Bus bus = getByBusNumber(busNumber);
        return new OccupancyDTO(bus.getBusNumber(), bus.getPassengers(), bus.getCapacity());
    }

    /**
     * Detailed info card when user clicks a bus marker on the map.
     */
    public BusDetailsDTO getDetails(String busNumber, double userLat, double userLon) {
        Bus bus = getByBusNumber(busNumber);
        double dist = haversine(userLat, userLon, bus.getLatitude(), bus.getLongitude());
        int eta = (int) Math.ceil((dist / Math.max(15.0, bus.getSpeed() > 0 ? bus.getSpeed() : AVERAGE_BUS_SPEED_KMH)) * 60.0);

        String routeNum = bus.getBusRoute() != null ? bus.getBusRoute().getRouteNumber() : bus.getRoute();
        String routeName = bus.getBusRoute() != null ? bus.getBusRoute().getRouteName() : bus.getRoute();
        String nextStop = bus.getNextStop() != null ? bus.getNextStop().getStopName() : "In Transit";

        return BusDetailsDTO.builder()
                .busNumber(bus.getBusNumber())
                .registrationNumber(bus.getRegistrationNumber() != null ? bus.getRegistrationNumber() : "AP07-TG-" + bus.getBusNumber())
                .routeNumber(routeNum)
                .routeName(routeName)
                .latitude(bus.getLatitude())
                .longitude(bus.getLongitude())
                .speed(bus.getSpeed())
                .status(bus.getStatus().name())
                .passengers(bus.getPassengers())
                .capacity(bus.getCapacity())
                .occupancyPercentage(bus.getOccupancyPercentage())
                .occupancyLevel(bus.getOccupancyLevel())
                .nextStopName(nextStop)
                .distanceKm(Math.round(dist * 10.0) / 10.0)
                .etaMinutes(eta)
                .build();
    }

    @Transactional
    public void updateLocation(BusLocationDTO dto) {
        Bus bus = busRepository.findByBusNumber(dto.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", "number", dto.getBusId()));

        bus.setLatitude(dto.getLatitude());
        bus.setLongitude(dto.getLongitude());
        if (dto.getSpeed()      != null) bus.setSpeed(dto.getSpeed());
        if (dto.getPassengers() != null) bus.setPassengers(dto.getPassengers());
        if (dto.getStatus()     != null) {
            try {
                bus.setStatus(BusStatus.valueOf(dto.getStatus()));
            } catch (Exception ignored) {}
        }

        busRepository.save(bus);
        dto.setTimestamp(System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/buses", dto);
        log.debug("Bus {} → [{}, {}] (Occupancy: {}%)", dto.getBusId(), dto.getLatitude(), dto.getLongitude(), bus.getOccupancyPercentage());
    }

    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}
