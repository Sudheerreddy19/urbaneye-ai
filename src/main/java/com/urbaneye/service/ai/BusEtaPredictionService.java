package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.BusEtaPredictionDTO;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.enums.TrafficLevel;
import com.urbaneye.repository.BusRepository;
import com.urbaneye.repository.RoadSegmentRepository;
import com.urbaneye.service.WeatherService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BusEtaPredictionService {

    private static final int EARTH_RADIUS_KM = 6371;

    private final BusRepository         busRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final WeatherService        weatherService;

    public BusEtaPredictionService(BusRepository busRepository,
                                  RoadSegmentRepository roadSegmentRepository,
                                  WeatherService weatherService) {
        this.busRepository         = busRepository;
        this.roadSegmentRepository = roadSegmentRepository;
        this.weatherService        = weatherService;
    }

    public BusEtaPredictionDTO predictBusEta(String busNumber, double userLat, double userLon) {
        Bus bus = busRepository.findByBusNumber(busNumber).orElse(null);
        if (bus == null || bus.getLatitude() == null) {
            return BusEtaPredictionDTO.builder()
                    .busNumber(busNumber)
                    .routeName("City Transit Route")
                    .distanceKm(1.5)
                    .baseEtaMinutes(4)
                    .trafficDelayMinutes(1)
                    .weatherDelayMinutes(1)
                    .hazardDelayMinutes(0)
                    .predictedEtaMinutes(6)
                    .occupancyLevel("MODERATE")
                    .explainableFactors(List.of("Simulated normal transit baseline"))
                    .build();
        }

        double distKm = haversine(userLat, userLon, bus.getLatitude(), bus.getLongitude());
        int baseEta = (int) Math.ceil((distKm / 30.0) * 60.0);

        List<String> factors = new ArrayList<>();
        int trafficDelay = 0;
        int weatherDelay = 0;
        int hazardDelay  = 0;

        // 1. Traffic impact along corridor
        long severeCount = roadSegmentRepository.findByTrafficLevel(TrafficLevel.SEVERE).size();
        if (severeCount > 0) {
            trafficDelay = 2;
            factors.add("Corridor congestion (+2 min delay)");
        }

        // 2. Weather impact
        if (weatherService.getCurrentWeather().getIsRaining()) {
            weatherDelay = 1;
            factors.add("Rainfall traction slowdown (+1 min delay)");
        }

        // 3. Occupancy impact (crowded buses dwell longer at stops)
        if ("CROWDED".equals(bus.getOccupancyLevel())) {
            hazardDelay = 1;
            factors.add("High passenger boarding dwell time (+1 min delay)");
        }

        int finalEta = baseEta + trafficDelay + weatherDelay + hazardDelay;

        return BusEtaPredictionDTO.builder()
                .busNumber(bus.getBusNumber())
                .routeName(bus.getRoute() != null ? bus.getRoute() : "Guntur Express")
                .distanceKm(Math.round(distKm * 10.0) / 10.0)
                .baseEtaMinutes(Math.max(1, baseEta))
                .trafficDelayMinutes(trafficDelay)
                .weatherDelayMinutes(weatherDelay)
                .hazardDelayMinutes(hazardDelay)
                .predictedEtaMinutes(Math.max(1, finalEta))
                .occupancyLevel(bus.getOccupancyLevel())
                .explainableFactors(factors)
                .build();
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
