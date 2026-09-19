package com.urbaneye.controller;

import com.urbaneye.dto.EmergencyRequestDTO;
import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.EmergencyStatus;
import com.urbaneye.entity.enums.Role;
import com.urbaneye.service.EmergencyRequestService;
import com.urbaneye.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Emergency Request REST API
 * Protected with strict IDOR ownership checks and role-based permissions.
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
    @PreAuthorize("hasAnyRole('POLICE', 'HOSPITAL')")
    public ResponseEntity<EmergencyRequest> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.acceptRequest(id));
    }

    /** Progress through EN_ROUTE → ARRIVED → PATIENT_PICKED */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('POLICE', 'HOSPITAL')")
    public ResponseEntity<EmergencyRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(
                emergencyService.updateStatus(id, EmergencyStatus.valueOf(status)));
    }

    /** Mark request completed — ambulance freed */
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('POLICE', 'HOSPITAL')")
    public ResponseEntity<EmergencyRequest> completeRequest(@PathVariable Long id) {
        return ResponseEntity.ok(emergencyService.completeRequest(id));
    }

    /** Cancel a request - protected by IDOR ownership check */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<EmergencyRequest> cancelRequest(@PathVariable Long id, Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        EmergencyRequest req = emergencyService.getById(id);

        // IDOR Check: Citizen can only cancel their own request
        if (user.getRole() == Role.CITIZEN || user.getRole() == Role.USER) {
            if (req.getUser() != null && !req.getUser().getId().equals(user.getId())) {
                throw new AccessDeniedException("Access denied: You cannot cancel another citizen's emergency request.");
            }
        }
        return ResponseEntity.ok(emergencyService.cancelRequest(id));
    }

    /** Get request details - protected by IDOR ownership check */
    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getById(@PathVariable Long id, Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        EmergencyRequest req = emergencyService.getById(id);

        // IDOR Check: Citizen can only view their own request
        if (user.getRole() == Role.CITIZEN || user.getRole() == Role.USER) {
            if (req.getUser() != null && !req.getUser().getId().equals(user.getId())) {
                throw new AccessDeniedException("Access denied: You cannot view another citizen's emergency request.");
            }
        }
        return ResponseEntity.ok(req);
    }

    /** All active requests (police / hospital use only) */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('POLICE', 'HOSPITAL')")
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
