package com.urbaneye.controller;

import com.urbaneye.dto.AmbulanceDetailsDTO;
import com.urbaneye.dto.AmbulanceLocationDTO;
import com.urbaneye.dto.NearbyAmbulanceDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.enums.AmbulanceStatus;
import com.urbaneye.service.AmbulanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Ambulance REST API — updated for Phase 2
 *
 * GET  /api/ambulances/nearby?latitude=&longitude=              — nearby available units
 * GET  /api/ambulances/{number}/details?latitude=&longitude=    — full click-card details
 * GET  /api/ambulances/{number}                                  — raw ambulance
 * GET  /api/ambulances                                           — all ambulances
 * POST /api/ambulances/location                                  — GPS update (driver/simulator)
 * PUT  /api/ambulances/{number}/status                          — change status
 */
@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyAmbulanceDTO>> getNearby(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(ambulanceService.findNearby(latitude, longitude));
    }

    /** Full click-card details with distance + ETA from user's location */
    @GetMapping("/{number}/details")
    public ResponseEntity<AmbulanceDetailsDTO> getDetails(
            @PathVariable String number,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(ambulanceService.getDetails(number, latitude, longitude));
    }

    @GetMapping("/{number}")
    public ResponseEntity<Ambulance> getByNumber(@PathVariable String number) {
        return ResponseEntity.ok(ambulanceService.getByAmbulanceNumber(number));
    }

    @GetMapping
    public ResponseEntity<List<Ambulance>> getAll() {
        return ResponseEntity.ok(ambulanceService.getAll());
    }

    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(@Valid @RequestBody AmbulanceLocationDTO dto) {
        ambulanceService.updateLocation(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{number}/status")
    public ResponseEntity<Ambulance> updateStatus(
            @PathVariable String number,
            @RequestParam String status) {
        return ResponseEntity.ok(
                ambulanceService.updateStatus(number, AmbulanceStatus.valueOf(status)));
    }
}
