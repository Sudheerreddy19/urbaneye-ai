package com.urbaneye.controller;

import com.urbaneye.dto.ai.*;
import com.urbaneye.service.ai.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 🧠 AI Decision Engine & Predictive Urban Intelligence REST API
 *
 * GET /api/ai/traffic/predict             — 15-min and 30-min traffic forecasts
 * GET /api/ai/bus/{busNumber}/eta         — multi-factor predicted bus ETA
 * GET /api/ai/hospitals/recommend         — explainable AI hospital triage selection
 * GET /api/ai/flood-risk                  — predictive flood and waterlogging risk
 * GET /api/ai/insights                    — central police operations AI insights feed
 * GET /api/ai/corridor/conflicts          — emergency vehicle green corridor conflict detection
 */
@RestController
@RequestMapping("/api/ai")
public class UrbanIntelligenceController {

    private final TrafficPredictionService      trafficPredictionService;
    private final BusEtaPredictionService       busEtaPredictionService;
    private final HospitalRecommendationService hospitalRecommendationService;
    private final FloodRiskService              floodRiskService;
    private final UrbanIntelligenceService      urbanIntelligenceService;
    private final EmergencyDecisionService      emergencyDecisionService;

    public UrbanIntelligenceController(TrafficPredictionService trafficPredictionService,
                                       BusEtaPredictionService busEtaPredictionService,
                                       HospitalRecommendationService hospitalRecommendationService,
                                       FloodRiskService floodRiskService,
                                       UrbanIntelligenceService urbanIntelligenceService,
                                       EmergencyDecisionService emergencyDecisionService) {
        this.trafficPredictionService      = trafficPredictionService;
        this.busEtaPredictionService       = busEtaPredictionService;
        this.hospitalRecommendationService = hospitalRecommendationService;
        this.floodRiskService              = floodRiskService;
        this.urbanIntelligenceService      = urbanIntelligenceService;
        this.emergencyDecisionService      = emergencyDecisionService;
    }

    @GetMapping("/traffic/predict")
    public ResponseEntity<List<TrafficPredictionDTO>> predictTraffic() {
        return ResponseEntity.ok(trafficPredictionService.predictAllCorridors());
    }

    @GetMapping("/bus/{busNumber}/eta")
    public ResponseEntity<BusEtaPredictionDTO> predictBusEta(
            @PathVariable String busNumber,
            @RequestParam(defaultValue = "16.3080") double userLat,
            @RequestParam(defaultValue = "80.4380") double userLon) {
        return ResponseEntity.ok(busEtaPredictionService.predictBusEta(busNumber, userLat, userLon));
    }

    @GetMapping("/hospitals/recommend")
    public ResponseEntity<HospitalRecommendationDTO> recommendHospital(
            @RequestParam(defaultValue = "16.3050") double patientLat,
            @RequestParam(defaultValue = "80.4320") double patientLon,
            @RequestParam(defaultValue = "CRITICAL") String severity,
            @RequestParam(defaultValue = "true") boolean requiresIcu) {
        return ResponseEntity.ok(
                hospitalRecommendationService.recommendHospital(patientLat, patientLon, severity, requiresIcu));
    }

    @GetMapping("/flood-risk")
    public ResponseEntity<List<FloodRiskDTO>> getFloodRisk() {
        return ResponseEntity.ok(floodRiskService.predictFloodRisks());
    }

    @GetMapping("/insights")
    public ResponseEntity<UrbanInsightsDTO> getCityInsights() {
        return ResponseEntity.ok(urbanIntelligenceService.getCityInsights());
    }

    @GetMapping("/corridor/conflicts")
    public ResponseEntity<List<EmergencyConflictDTO>> getCorridorConflicts() {
        return ResponseEntity.ok(emergencyDecisionService.detectAndResolveCorridorConflicts());
    }
}
