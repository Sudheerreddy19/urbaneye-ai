package com.urbaneye.service;

import com.urbaneye.dto.IncidentDTO;
import com.urbaneye.entity.Incident;
import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.IncidentSeverity;
import com.urbaneye.entity.enums.IncidentStatus;
import com.urbaneye.entity.enums.IncidentType;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.IncidentRepository;
import com.urbaneye.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class IncidentService {

    private static final Logger log = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository    incidentRepository;
    private final UserRepository        userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public IncidentService(IncidentRepository incidentRepository,
                           UserRepository userRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.incidentRepository = incidentRepository;
        this.userRepository     = userRepository;
        this.messagingTemplate  = messagingTemplate;
    }

    public List<Incident> getAll()  { return incidentRepository.findAllByOrderByCreatedAtDesc(); }

    public List<Incident> getOpen() {
        return incidentRepository.findByStatusOrderByCreatedAtDesc(IncidentStatus.REPORTED);
    }

    public List<Incident> getByType(IncidentType type) {
        return incidentRepository.findByType(type);
    }

    public Incident getById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
    }

    @Transactional
    public Incident report(IncidentDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Incident incident = Incident.builder()
                .type(dto.getType())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .description(dto.getDescription())
                .severity(dto.getSeverity() != null ? dto.getSeverity() : IncidentSeverity.MEDIUM)
                .reportedBy(user)
                .status(IncidentStatus.REPORTED)
                .build();

        Incident saved = incidentRepository.save(incident);
        log.info("⚠️ Hazard/Incident reported: {} [{}] by {}", saved.getType(), saved.getSeverity(), userId);

        Map<String, Object> event = Map.of(
                "id",          saved.getId(),
                "type",        saved.getType().name(),
                "severity",    saved.getSeverity().name(),
                "status",      saved.getStatus().name(),
                "latitude",    saved.getLatitude(),
                "longitude",   saved.getLongitude(),
                "description", saved.getDescription() != null ? saved.getDescription() : "",
                "reportedBy",  user.getName(),
                "timestamp",   System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend("/topic/incidents", event);
        messagingTemplate.convertAndSend("/topic/police/incidents", event);
        return saved;
    }

    @Transactional
    public Incident acknowledge(Long id) {
        Incident i = getById(id);
        i.setStatus(IncidentStatus.ACKNOWLEDGED);
        Incident saved = incidentRepository.save(i);
        messagingTemplate.convertAndSend("/topic/incidents", Map.of(
                "id", saved.getId(), "status", saved.getStatus().name(), "type", saved.getType().name()
        ));
        return saved;
    }

    @Transactional
    public Incident setInProgress(Long id) {
        Incident i = getById(id);
        i.setStatus(IncidentStatus.IN_PROGRESS);
        Incident saved = incidentRepository.save(i);
        messagingTemplate.convertAndSend("/topic/incidents", Map.of(
                "id", saved.getId(), "status", saved.getStatus().name(), "type", saved.getType().name()
        ));
        return saved;
    }

    @Transactional
    public Incident resolve(Long id) {
        Incident i = getById(id);
        i.setStatus(IncidentStatus.RESOLVED);
        Incident saved = incidentRepository.save(i);
        messagingTemplate.convertAndSend("/topic/incidents", Map.of(
                "id", saved.getId(), "status", saved.getStatus().name(), "type", saved.getType().name()
        ));
        return saved;
    }
}
