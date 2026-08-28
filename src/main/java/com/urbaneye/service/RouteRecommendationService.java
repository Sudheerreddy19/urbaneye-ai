package com.urbaneye.service;

import com.urbaneye.dto.RouteRecommendationDTO;
import com.urbaneye.dto.TravelOptionDTO;
import com.urbaneye.entity.RoadSegment;
import com.urbaneye.entity.enums.TrafficLevel;
import com.urbaneye.repository.RoadSegmentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RouteRecommendationService {

    private static final int EARTH_RADIUS_KM = 6371;

    private final RoadSegmentRepository roadSegmentRepository;

    public RouteRecommendationService(RoadSegmentRepository roadSegmentRepository) {
        this.roadSegmentRepository = roadSegmentRepository;
    }

    public RouteRecommendationDTO getRecommendations(double fromLat, double fromLon,
                                                     double toLat, double toLon,
                                                     String fromName, String toName) {
        double distKm = haversine(fromLat, fromLon, toLat, toLon);
        // Add 25% road detour factor
        distKm = Math.round(distKm * 1.25 * 10.0) / 10.0;

        // Assess overall traffic condition across road segments
        List<RoadSegment> segments = roadSegmentRepository.findAll();
        long severeCount = segments.stream().filter(s -> s.getTrafficLevel() == TrafficLevel.SEVERE).count();
        long highCount   = segments.stream().filter(s -> s.getTrafficLevel() == TrafficLevel.HIGH).count();

        String trafficCondition = "LOW";
        double trafficDelayFactor = 1.0;

        if (severeCount > 0) {
            trafficCondition = "SEVERE";
            trafficDelayFactor = 1.6;
        } else if (highCount > 0) {
            trafficCondition = "HIGH";
            trafficDelayFactor = 1.35;
        } else if (segments.stream().anyMatch(s -> s.getTrafficLevel() == TrafficLevel.MODERATE)) {
            trafficCondition = "MODERATE";
            trafficDelayFactor = 1.15;
        }

        List<TravelOptionDTO> options = new ArrayList<>();

        // 1. Two-Wheeler / Bike (weaves through traffic, fastest in congestion)
        int bikeSpeed = 35;
        int bikeDuration = (int) Math.ceil(((distKm / bikeSpeed) * 60.0) * (trafficDelayFactor > 1.2 ? 1.1 : 1.0));
        int bikeFare = (int) Math.round(distKm * 3.0 + 10);
        options.add(TravelOptionDTO.builder()
                .mode("BIKE")
                .durationMinutes(bikeDuration)
                .fareInr(Math.max(20, bikeFare))
                .distanceKm(distKm)
                .trafficCondition(trafficCondition)
                .badge("FASTEST OPTION")
                .build());

        // 2. Bus / Public Transit (cheap, steady, fixed stops)
        int busSpeed = 25;
        int busDuration = (int) Math.ceil(((distKm / busSpeed) * 60.0) * trafficDelayFactor + 5); // +5 min wait time
        int busFare = (int) Math.round(distKm * 1.5 + 10);
        options.add(TravelOptionDTO.builder()
                .mode("BUS")
                .durationMinutes(busDuration)
                .fareInr(Math.min(50, Math.max(15, busFare)))
                .distanceKm(distKm)
                .trafficCondition(trafficCondition)
                .badge("CHEAPEST OPTION")
                .build());

        // 3. Car / Cab (comfortable, subject to traffic)
        int carSpeed = 40;
        int carDuration = (int) Math.ceil(((distKm / carSpeed) * 60.0) * trafficDelayFactor);
        int carFare = (int) Math.round(distKm * 12.0 + 50);
        options.add(TravelOptionDTO.builder()
                .mode("CAR")
                .durationMinutes(carDuration)
                .fareInr(Math.max(80, carFare))
                .distanceKm(distKm)
                .trafficCondition(trafficCondition)
                .badge("COMFORT")
                .build());

        // 4. Metro / Suburban (if distance > 10 km)
        if (distKm >= 10.0) {
            int metroDuration = (int) Math.ceil((distKm / 55.0) * 60.0 + 6);
            int metroFare = (int) Math.round(distKm * 2.5 + 10);
            options.add(TravelOptionDTO.builder()
                    .mode("METRO")
                    .durationMinutes(metroDuration)
                    .fareInr(Math.max(20, metroFare))
                    .distanceKm(distKm)
                    .trafficCondition("LOW")
                    .badge("TRAFFIC-FREE")
                    .build());
        }

        // Determine recommended option (fastest by default, or balanced)
        options.sort(Comparator.comparingInt(TravelOptionDTO::getDurationMinutes));
        TravelOptionDTO recommended = options.get(0);

        List<TravelOptionDTO> finalOptions = new ArrayList<>();
        for (TravelOptionDTO opt : options) {
            boolean isRec = opt.getMode().equals(recommended.getMode());
            finalOptions.add(TravelOptionDTO.builder()
                    .mode(opt.getMode())
                    .durationMinutes(opt.getDurationMinutes())
                    .fareInr(opt.getFareInr())
                    .distanceKm(opt.getDistanceKm())
                    .trafficCondition(opt.getTrafficCondition())
                    .isRecommended(isRec)
                    .badge(isRec ? "⭐ RECOMMENDED (" + opt.getBadge() + ")" : opt.getBadge())
                    .build());
        }

        String badge = "⭐ FASTEST OPTION: " + recommended.getMode() + " (" + recommended.getDurationMinutes() + " min)";

        return RouteRecommendationDTO.builder()
                .fromName(fromName != null ? fromName : "Current Location")
                .toName(toName != null ? toName : "Destination")
                .distanceKm(distKm)
                .recommendationBadge(badge)
                .options(finalOptions)
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
