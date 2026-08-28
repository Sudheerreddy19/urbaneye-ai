package com.urbaneye.controller;

import com.urbaneye.dto.GreenCorridorStatusDTO;
import com.urbaneye.entity.SignalEvent;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.service.GreenCorridorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Emergency Green Corridor & Traffic Signal Preemption REST API
 *
 * POST /api/signals/green-corridor/{ambulanceNumber}             — activate green corridor
 * POST /api/signals/green-corridor/{ambulanceNumber}/deactivate  — deactivate green corridor
 * GET  /api/signals/green-corridor/{ambulanceNumber}/status      — live corridor & upcoming signals status
 * GET  /api/signals/active-corridors                             — all currently forced-green signals
 * GET  /api/signals/events                                       — preemption audit event logs
 */
@RestController
@RequestMapping("/api/signals")
public class SignalController {

    private final GreenCorridorService greenCorridorService;

    public SignalController(GreenCorridorService greenCorridorService) {
        this.greenCorridorService = greenCorridorService;
    }

    @PostMapping("/green-corridor/{ambulanceNumber}")
    public ResponseEntity<List<Map<String, Object>>> activateGreenCorridor(
            @PathVariable String ambulanceNumber) {
        return ResponseEntity.ok(greenCorridorService.activateGreenCorridor(ambulanceNumber));
    }

    @PostMapping("/green-corridor/{ambulanceNumber}/deactivate")
    public ResponseEntity<Void> deactivateGreenCorridor(
            @PathVariable String ambulanceNumber) {
        greenCorridorService.deactivateGreenCorridor(ambulanceNumber);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/green-corridor/{ambulanceNumber}/status")
    public ResponseEntity<GreenCorridorStatusDTO> getCorridorStatus(
            @PathVariable String ambulanceNumber) {
        return ResponseEntity.ok(greenCorridorService.getCorridorStatus(ambulanceNumber));
    }

    @GetMapping("/active-corridors")
    public ResponseEntity<List<TrafficSignal>> getActiveCorridors() {
        return ResponseEntity.ok(greenCorridorService.getActiveCorridors());
    }

    @GetMapping("/events")
    public ResponseEntity<List<SignalEvent>> getRecentEvents() {
        return ResponseEntity.ok(greenCorridorService.getRecentEvents());
    }
}
