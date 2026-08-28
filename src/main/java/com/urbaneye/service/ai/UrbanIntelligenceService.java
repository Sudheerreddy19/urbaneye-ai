package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.FloodRiskDTO;
import com.urbaneye.dto.ai.TrafficPredictionDTO;
import com.urbaneye.dto.ai.UrbanInsightsDTO;
import com.urbaneye.entity.Hospital;
import com.urbaneye.entity.enums.TrafficLevel;
import com.urbaneye.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UrbanIntelligenceService {

    private final TrafficPredictionService      trafficPredictionService;
    private final FloodRiskService              floodRiskService;
    private final HospitalRepository            hospitalRepository;
    private final EmergencyDecisionService      emergencyDecisionService;

    public UrbanIntelligenceService(TrafficPredictionService trafficPredictionService,
                                   FloodRiskService floodRiskService,
                                   HospitalRepository hospitalRepository,
                                   EmergencyDecisionService emergencyDecisionService) {
        this.trafficPredictionService = trafficPredictionService;
        this.floodRiskService         = floodRiskService;
        this.hospitalRepository       = hospitalRepository;
        this.emergencyDecisionService = emergencyDecisionService;
    }

    public UrbanInsightsDTO getCityInsights() {
        List<String> trafficAlerts = new ArrayList<>();
        List<String> floodAlerts   = new ArrayList<>();
        List<String> hospitalAlerts= new ArrayList<>();
        List<String> corridorAlerts= new ArrayList<>();

        // Traffic predictions
        List<TrafficPredictionDTO> trafficList = trafficPredictionService.predictAllCorridors();
        for (TrafficPredictionDTO t : trafficList) {
            if (t.getPredicted15MinLevel() == TrafficLevel.SEVERE) {
                trafficAlerts.add("🔴 " + t.getRoadName() + " severe congestion predicted in 15 mins (avg speed < " + t.getPredicted15MinSpeed() + " km/h).");
            }
        }
        if (trafficAlerts.isEmpty()) {
            trafficAlerts.add("🟢 City arterial traffic flow is within optimal capacity.");
        }

        // Flood risks
        List<FloodRiskDTO> floods = floodRiskService.predictFloodRisks();
        for (FloodRiskDTO f : floods) {
            if ("HIGH".equals(f.getRiskLevel()) || "CRITICAL".equals(f.getRiskLevel())) {
                floodAlerts.add("⚠️ " + f.getZoneName() + " flood risk increasing (Depth: " + f.getCurrentWaterDepthCm() + "cm). " + f.getRecommendedAlternateCorridor());
            }
        }

        // Hospital capacity load
        List<Hospital> hospitals = hospitalRepository.findAll();
        for (Hospital h : hospitals) {
            if (h.getAvailableIcuBeds() <= 2) {
                hospitalAlerts.add("🏥 " + h.getName() + " emergency ICU load pressure HIGH (" + h.getAvailableIcuBeds() + " ICU beds remaining).");
            }
        }

        // Emergency Green Corridor
        corridorAlerts.add("🚑 AMB-101 Proactive Green Corridor sequence active along MG Road to GGH.");

        return UrbanInsightsDTO.builder()
                .trafficAlerts(trafficAlerts)
                .floodRiskAlerts(floodAlerts)
                .hospitalLoadAlerts(hospitalAlerts)
                .emergencyCorridorAlerts(corridorAlerts)
                .aiConfidenceScore(0.95)
                .build();
    }
}
