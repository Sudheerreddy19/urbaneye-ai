package com.urbaneye.controller;

import com.urbaneye.dto.HospitalCapacityDTO;
import com.urbaneye.dto.IncomingEmergencyCaseDTO;
import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.Hospital;
import com.urbaneye.entity.HospitalBed;
import com.urbaneye.entity.enums.BedStatus;
import com.urbaneye.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Hospital Emergency Coordination REST API
 *
 * GET /api/hospital/capacity?hospitalId=          — full emergency room, bed, blood, doctor capacity
 * PUT /api/hospital/resources                     — update blood units, emergency doctors, ER status
 * GET /api/hospital/incoming-queue?hospitalId=    — prioritized incoming ambulance emergency queue
 * GET /api/hospital/details                       — all hospital profiles
 * GET /api/hospital/beds?hospitalId=              — hospital beds status
 * PUT /api/hospital/beds/{id}/status              — update bed status
 */
@RestController
@RequestMapping("/api/hospital")
@PreAuthorize("hasRole('HOSPITAL')")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/details")
    public ResponseEntity<List<Hospital>> getDetails() {
        return ResponseEntity.ok(hospitalService.getAll());
    }

    @GetMapping("/capacity")
    public ResponseEntity<HospitalCapacityDTO> getCapacity(@RequestParam Long hospitalId) {
        return ResponseEntity.ok(hospitalService.getCapacity(hospitalId));
    }

    @PutMapping("/resources")
    public ResponseEntity<HospitalCapacityDTO> updateResources(
            @RequestParam Long hospitalId,
            @RequestParam(required = false) Integer bloodUnits,
            @RequestParam(required = false) Integer emergencyDoctors,
            @RequestParam(required = false) Boolean erAvailable) {
        return ResponseEntity.ok(
                hospitalService.updateResources(hospitalId, bloodUnits, emergencyDoctors, erAvailable));
    }

    @GetMapping("/incoming-queue")
    public ResponseEntity<List<IncomingEmergencyCaseDTO>> getIncomingQueue(@RequestParam Long hospitalId) {
        return ResponseEntity.ok(hospitalService.getIncomingQueue(hospitalId));
    }

    @GetMapping("/beds")
    public ResponseEntity<Map<String, Object>> getBeds(@RequestParam Long hospitalId) {
        List<HospitalBed> beds = hospitalService.getBedsByHospital(hospitalId);
        long available = beds.stream().filter(b -> b.getStatus() == BedStatus.AVAILABLE).count();
        long occupied  = beds.stream().filter(b -> b.getStatus() == BedStatus.OCCUPIED).count();
        return ResponseEntity.ok(Map.of("beds", beds, "total", beds.size(), "available", available, "occupied", occupied));
    }

    @PutMapping("/beds/{id}/status")
    public ResponseEntity<HospitalBed> updateBedStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(hospitalService.updateBedStatus(id, BedStatus.valueOf(status)));
    }

    @PostMapping("/alerts/{requestId}")
    public ResponseEntity<Void> sendAlert(
            @PathVariable Long requestId, @RequestParam Long hospitalId) {
        hospitalService.notifyIncomingAmbulance(hospitalId, requestId);
        return ResponseEntity.ok().build();
    }
}
