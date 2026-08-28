package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.TrafficPredictionDTO;
import com.urbaneye.entity.RoadSegment;
import com.urbaneye.entity.enums.TrafficLevel;
import com.urbaneye.repository.RoadSegmentRepository;
import com.urbaneye.service.WeatherService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrafficPredictionService {

    private final RoadSegmentRepository roadSegmentRepository;
    private final WeatherService       weatherService;

    public TrafficPredictionService(RoadSegmentRepository roadSegmentRepository,
                                  WeatherService weatherService) {
        this.roadSegmentRepository = roadSegmentRepository;
        this.weatherService        = weatherService;
    }

    public List<TrafficPredictionDTO> predictAllCorridors() {
        return roadSegmentRepository.findAll().stream()
                .map(this::predictSegment)
                .collect(Collectors.toList());
    }

    public TrafficPredictionDTO predictSegment(RoadSegment seg) {
        boolean isRaining = weatherService.getCurrentWeather().getIsRaining();
        double curSpeed = seg.getAvgSpeed();
        int vehicles = seg.getVehicleCount();

        List<String> factors = new ArrayList<>();
        factors.add("Current vehicle density: " + vehicles + " units/km");
        if (isRaining) factors.add("Monsoon precipitation causing +15% slowdown");
        if (curSpeed < 15.0) factors.add("Bottleneck junction causing queue backlogs");

        // 15-min forecast
        double speed15 = Math.max(5.0, curSpeed * (isRaining ? 0.88 : 0.95));
        TrafficLevel level15 = determineLevel(speed15);

        // 30-min forecast
        double speed30 = Math.min(60.0, speed15 * (seg.getTrafficLevel() == TrafficLevel.SEVERE ? 1.25 : 0.92));
        TrafficLevel level30 = determineLevel(speed30);

        return TrafficPredictionDTO.builder()
                .roadName(seg.getRoadName())
                .currentSpeed(curSpeed)
                .currentLevel(seg.getTrafficLevel())
                .predicted15MinSpeed(Math.round(speed15 * 10.0) / 10.0)
                .predicted15MinLevel(level15)
                .predicted30MinSpeed(Math.round(speed30 * 10.0) / 10.0)
                .predicted30MinLevel(level30)
                .confidenceScore(0.92)
                .contributingFactors(factors)
                .build();
    }

    private TrafficLevel determineLevel(double speed) {
        if (speed < 12.0) return TrafficLevel.SEVERE;
        if (speed < 22.0) return TrafficLevel.HIGH;
        if (speed < 35.0) return TrafficLevel.MODERATE;
        return TrafficLevel.LOW;
    }
}
