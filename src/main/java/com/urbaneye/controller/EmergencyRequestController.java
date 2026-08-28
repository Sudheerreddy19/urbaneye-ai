package com.urbaneye.controller;

import com.urbaneye.dto.EmergencyRequestDTO;
import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.EmergencyStatus;
import com.urbaneye.service.EmergencyRequestService;
import com.urbaneye.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Emergency Request REST API — Step 7
 *
 * POST   /api/emergency/request              — user creates request
 * PUT    /api/emergency/{id}/accept          — dispatch accepts
 * PUT    /api/emergency/{id}/status          — update lifecycle status
 * PUT    /api/emergency/{id}/complete        — mark completed
 * PUT    /api/emergency/{id}/cancel          — cancel request
 * GET    /api/emergency/{id}                 — request detail
 * GET    /api/emergency/active               — all active requests (police)
 * GET    /api/emergency/my                   — current user's requests
 */
@RestController
@RequestMapping("/api/emergency")
public class EmergencyRequestController {

    private final EmergencyRequestService emergencyService;
    private final UserService             userService;

    public EmergencyRequestController(EmergencyRequestService emergencyService,
                                      UserService userService) {
        this.emergencyService = emergencyService;
        this.userService      = userService;
    }

    /** User requests an ambulance */
    @PostMapping("/request")
    public ResponseEntity<EmergencyRequest> createRequest(
            @Valid @RequestBody EmergencyRequestDTO dto,
            Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emergencyService.createRequest(dto, user.getId()));
    }

    /** Dispatch/driver accepts the request → ambulance becomes EMERGENCY */
    @PutMapping("/{id}/accept")
    public ResponseEntity<EmergencyRequest> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.acceptRequest(id));
    }

    /** Progress through EN_ROUTE → ARRIVED → PATIENT_PICKED */
    @PutMapping("/{id}/status")
    public ResponseEntity<EmergencyRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(
                emergencyService.updateStatus(id, EmergencyStatus.valueOf(status)));
    }

    /** Mark request completed — ambulance freed */
    @PutMapping("/{id}/complete")
    public ResponseEntity<EmergencyRequest> completeRequest(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.completeRequest(id));
    }

    /** Cancel a request */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<EmergencyRequest> cancelRequest(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.cancelRequest(id));
    }

    /** Get request details */
    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.getById(id));
    }

    /** All active requests (police / hospital use) */
    @GetMapping("/active")
    public ResponseEntity<List<EmergencyRequest>> getActive() {
        return ResponseEntity.ok(emergencyService.getActiveRequests());
    }

    /** Current logged-in user's requests */
    @GetMapping("/my")
    public ResponseEntity<List<EmergencyRequest>> getMyRequests(Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        return ResponseEntity.ok(emergencyService.getRequestsByUser(user.getId()));
    }
}
