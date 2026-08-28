package com.urbaneye.controller;

import com.urbaneye.dto.IncidentDTO;
import com.urbaneye.entity.Incident;
import com.urbaneye.entity.User;
import com.urbaneye.service.IncidentService;
import com.urbaneye.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Road Hazard & City Incident Reporting REST API
 */
@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;
    private final UserService     userService;

    public IncidentController(IncidentService incidentService, UserService userService) {
        this.incidentService = incidentService;
        this.userService     = userService;
    }

    @PostMapping
    public ResponseEntity<Incident> report(
            @Valid @RequestBody IncidentDTO dto, Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(incidentService.report(dto, user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAll() {
        return ResponseEntity.ok(incidentService.getAll());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Incident>> getOpen() {
        return ResponseEntity.ok(incidentService.getOpen());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Incident> getById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getById(id));
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<Incident> acknowledge(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.acknowledge(id));
    }

    @PutMapping("/{id}/in-progress")
    public ResponseEntity<Incident> setInProgress(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.setInProgress(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Incident> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.resolve(id));
    }
}
