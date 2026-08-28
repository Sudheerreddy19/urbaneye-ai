package com.urbaneye.controller;

import com.urbaneye.dto.RoadSegmentDTO;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.enums.SignalState;
import com.urbaneye.service.TrafficService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/traffic")
public class TrafficController {

    private final TrafficService trafficService;

    public TrafficController(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    // ── Traffic Signals ───────────────────────────────────────────────────────

    @GetMapping("/signals")
    public ResponseEntity<List<TrafficSignal>> getAllSignals() {
        return ResponseEntity.ok(trafficService.getAllSignals());
    }

    @GetMapping("/signals/{id}")
    public ResponseEntity<TrafficSignal> getSignal(@PathVariable Long id) {
        return ResponseEntity.ok(trafficService.getById(id));
    }

    @PutMapping("/signals/{id}/state")
    public ResponseEntity<TrafficSignal> updateState(
            @PathVariable Long id, @RequestParam String state) {
        return ResponseEntity.ok(trafficService.updateState(id, SignalState.valueOf(state)));
    }

    // ── Road Segments (Part 3 Urban Traffic) ───────────────────────────────────

    @GetMapping("/segments")
    public ResponseEntity<List<RoadSegmentDTO>> getAllSegments() {
        return ResponseEntity.ok(trafficService.getAllRoadSegments());
    }

    @GetMapping("/segments/{id}")
    public ResponseEntity<RoadSegmentDTO> getSegment(@PathVariable Long id) {
        return ResponseEntity.ok(trafficService.getRoadSegment(id));
    }

    @PutMapping("/segments/{id}/update")
    public ResponseEntity<RoadSegmentDTO> updateSegmentTraffic(
            @PathVariable Long id,
            @RequestParam Double avgSpeed,
            @RequestParam Integer vehicleCount) {
        return ResponseEntity.ok(trafficService.updateRoadTraffic(id, avgSpeed, vehicleCount));
    }

    @GetMapping("/density")
    public ResponseEntity<Map<String, Object>> getDensity() {
        return ResponseEntity.ok(trafficService.getDensitySummary());
    }
}
