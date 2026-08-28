package com.urbaneye.service;

import com.urbaneye.dto.EmergencyRequestDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.Hospital;
import com.urbaneye.entity.User;
import com.urbaneye.entity.enums.AmbulanceStatus;
import com.urbaneye.entity.enums.EmergencyStatus;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.AmbulanceRepository;
import com.urbaneye.repository.EmergencyRequestRepository;
import com.urbaneye.repository.HospitalRepository;
import com.urbaneye.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Core Phase 2 service — manages the full emergency request lifecycle.
 *
 * Workflow:
 *   createRequest()   → REQUESTED  | ambulance = BUSY
 *   acceptRequest()   → ACCEPTED   | ambulance = EMERGENCY | ← police notified
 *   updateStatus()    → EN_ROUTE / ARRIVED / PATIENT_PICKED
 *   completeRequest() → COMPLETED  | ambulance = AVAILABLE
 *   cancelRequest()   → CANCELLED  | ambulance = AVAILABLE
 *
 * WebSocket broadcasts:
 *   /topic/ambulances          — every location update
 *   /topic/police              — ambulance enters EMERGENCY
 *   /topic/hospital/{id}       — incoming ambulance alert
 *   /topic/emergency/{reqId}   — status updates for the requesting user
 */
@Service
public class EmergencyRequestService {

    private static final Logger log = LoggerFactory.getLogger(EmergencyRequestService.class);

    private final EmergencyRequestRepository requestRepository;
    private final AmbulanceRepository        ambulanceRepository;
    private final UserRepository             userRepository;
    private final HospitalRepository         hospitalRepository;
    private final SimpMessagingTemplate      messagingTemplate;

    public EmergencyRequestService(EmergencyRequestRepository requestRepository,
                                   AmbulanceRepository ambulanceRepository,
                                   UserRepository userRepository,
                                   HospitalRepository hospitalRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.requestRepository  = requestRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.userRepository     = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.messagingTemplate  = messagingTemplate;
    }

    // ── 1. Create ─────────────────────────────────────────────────────────────

    /**
     * User submits an emergency request for a specific ambulance.
     * Ambulance is marked BUSY immediately so no other user can request it.
     */
    @Transactional
    public EmergencyRequest createRequest(EmergencyRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Ambulance ambulance = ambulanceRepository.findByAmbulanceNumber(dto.getAmbulanceNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ambulance", "number", dto.getAmbulanceNumber()));

        if (ambulance.getStatus() != AmbulanceStatus.AVAILABLE) {
            throw new IllegalStateException(
                    "Ambulance " + ambulance.getAmbulanceNumber()
                    + " is not available. Current status: " + ambulance.getStatus());
        }

        Hospital hospital = null;
        if (dto.getHospitalId() != null) {
            hospital = hospitalRepository.findById(dto.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Hospital", "id", dto.getHospitalId()));
        }

        // Mark ambulance BUSY immediately
        ambulance.setStatus(AmbulanceStatus.BUSY);
        ambulanceRepository.save(ambulance);

        EmergencyRequest req = EmergencyRequest.builder()
                .user(user)
                .ambulance(ambulance)
                .hospital(hospital)
                .patientName(dto.getPatientName())
                .description(dto.getDescription())
                .pickupLatitude(dto.getPickupLatitude())
                .pickupLongitude(dto.getPickupLongitude())
                .severity(dto.getSeverity())
                .status(EmergencyStatus.REQUESTED)
                .build();

        EmergencyRequest saved = requestRepository.save(req);
        log.info("🚨 Emergency request #{} created — ambulance {}", saved.getId(), ambulance.getAmbulanceNumber());

        // Notify user's tracking channel
        broadcastStatusUpdate(saved);
        return saved;
    }

    // ── 2. Accept ─────────────────────────────────────────────────────────────

    /**
     * Driver/dispatch accepts the request.
     * Ambulance status → EMERGENCY.
     * Police dashboard and hospital are notified via WebSocket.
     */
    @Transactional
    public EmergencyRequest acceptRequest(Long requestId) {
        EmergencyRequest req = getById(requestId);
        assertStatus(req, EmergencyStatus.REQUESTED, "accept");

        req.setStatus(EmergencyStatus.ACCEPTED);
        req.setAcceptedAt(LocalDateTime.now());

        Ambulance ambulance = req.getAmbulance();
        ambulance.setStatus(AmbulanceStatus.EMERGENCY);
        ambulanceRepository.save(ambulance);
        requestRepository.save(req);

        log.info("✅ Request #{} accepted — AMB {} → EMERGENCY", requestId, ambulance.getAmbulanceNumber());

        // Notify police dashboard
        notifyPolice(req);

        // Notify hospital if assigned
        if (req.getHospital() != null) {
            notifyHospital(req);
        }

        broadcastStatusUpdate(req);
        return req;
    }

    // ── 3. Progressive status updates ─────────────────────────────────────────

    /**
     * Moves the request through: ACCEPTED → EN_ROUTE → ARRIVED → PATIENT_PICKED
     */
    @Transactional
    public EmergencyRequest updateStatus(Long requestId, EmergencyStatus newStatus) {
        EmergencyRequest req = getById(requestId);

        validateTransition(req.getStatus(), newStatus);
        req.setStatus(newStatus);
        requestRepository.save(req);

        log.info("Request #{} status → {}", requestId, newStatus);
        broadcastStatusUpdate(req);

        // Re-notify hospital when ambulance actually arrives
        if (newStatus == EmergencyStatus.EN_ROUTE && req.getHospital() != null) {
            notifyHospital(req);
        }

        return req;
    }

    // ── 4. Complete ───────────────────────────────────────────────────────────

    @Transactional
    public EmergencyRequest completeRequest(Long requestId) {
        EmergencyRequest req = getById(requestId);

        req.setStatus(EmergencyStatus.COMPLETED);
        req.setCompletedAt(LocalDateTime.now());

        // Free the ambulance
        req.getAmbulance().setStatus(AmbulanceStatus.AVAILABLE);
        ambulanceRepository.save(req.getAmbulance());
        requestRepository.save(req);

        log.info("✅ Request #{} COMPLETED — AMB {} → AVAILABLE",
                requestId, req.getAmbulance().getAmbulanceNumber());

        broadcastStatusUpdate(req);
        return req;
    }

    // ── 5. Cancel ─────────────────────────────────────────────────────────────

    @Transactional
    public EmergencyRequest cancelRequest(Long requestId) {
        EmergencyRequest req = getById(requestId);

        if (req.getStatus() == EmergencyStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed request.");
        }

        req.setStatus(EmergencyStatus.CANCELLED);

        // Free the ambulance only if it hasn't picked the patient yet
        AmbulanceStatus curAmb = req.getAmbulance().getStatus();
        if (curAmb == AmbulanceStatus.BUSY || curAmb == AmbulanceStatus.EMERGENCY) {
            req.getAmbulance().setStatus(AmbulanceStatus.AVAILABLE);
            ambulanceRepository.save(req.getAmbulance());
        }

        requestRepository.save(req);
        log.info("❌ Request #{} CANCELLED — AMB {} freed", requestId, req.getAmbulance().getAmbulanceNumber());
        broadcastStatusUpdate(req);
        return req;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public EmergencyRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyRequest", "id", id));
    }

    public List<EmergencyRequest> getActiveRequests() {
        return requestRepository.findByStatusInOrderByRequestedAtDesc(List.of(
                EmergencyStatus.REQUESTED,
                EmergencyStatus.ACCEPTED,
                EmergencyStatus.EN_ROUTE,
                EmergencyStatus.ARRIVED,
                EmergencyStatus.PATIENT_PICKED
        ));
    }

    public List<EmergencyRequest> getRequestsByUser(Long userId) {
        return requestRepository.findByUserIdAndStatusNotIn(userId,
                List.of(EmergencyStatus.CANCELLED));
    }

    // ── WebSocket Broadcasts ──────────────────────────────────────────────────

    private void broadcastStatusUpdate(EmergencyRequest req) {
        Map<String, Object> event = buildEvent(req);
        // User tracking channel
        messagingTemplate.convertAndSend(
                "/topic/emergency/" + req.getId(), event);
        // General police/dashboard channel
        messagingTemplate.convertAndSend("/topic/emergency", event);
    }

    /**
     * Notifies police dashboard of a new active emergency.
     * Sent to /topic/police
     */
    private void notifyPolice(EmergencyRequest req) {
        Map<String, Object> event = buildEvent(req);
        event.put("alert", "🚨 NEW EMERGENCY — " + req.getAmbulance().getAmbulanceNumber());
        messagingTemplate.convertAndSend("/topic/police", event);
        log.debug("Police notified of emergency #{}", req.getId());
    }

    /**
     * Notifies the destination hospital of an incoming ambulance.
     * Sent to /topic/hospital/{hospitalId}
     */
    private void notifyHospital(EmergencyRequest req) {
        Hospital h = req.getHospital();
        Map<String, Object> alert = new HashMap<>();
        alert.put("type",            "INCOMING_AMBULANCE");
        alert.put("requestId",       req.getId());
        alert.put("ambulanceNumber", req.getAmbulance().getAmbulanceNumber());
        alert.put("patientName",     req.getPatientName() != null ? req.getPatientName() : "Unknown");
        alert.put("severity",        req.getSeverity().name());
        alert.put("status",          req.getStatus().name());
        alert.put("pickupLatitude",  req.getPickupLatitude());
        alert.put("pickupLongitude", req.getPickupLongitude());
        alert.put("message",         "🚑 Ambulance incoming — prepare emergency room!");
        messagingTemplate.convertAndSend("/topic/hospital/" + h.getId(), alert);
        log.info("Hospital {} notified — incoming AMB {}", h.getName(),
                req.getAmbulance().getAmbulanceNumber());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Map<String, Object> buildEvent(EmergencyRequest req) {
        Map<String, Object> e = new HashMap<>();
        e.put("requestId",       req.getId());
        e.put("status",          req.getStatus().name());
        e.put("ambulanceNumber", req.getAmbulance().getAmbulanceNumber());
        e.put("ambulanceLat",    req.getAmbulance().getLatitude());
        e.put("ambulanceLon",    req.getAmbulance().getLongitude());
        e.put("severity",        req.getSeverity().name());
        e.put("pickupLatitude",  req.getPickupLatitude());
        e.put("pickupLongitude", req.getPickupLongitude());
        e.put("timestamp",       System.currentTimeMillis());
        if (req.getHospital() != null) {
            e.put("hospitalId",   req.getHospital().getId());
            e.put("hospitalName", req.getHospital().getName());
        }
        return e;
    }

    private void assertStatus(EmergencyRequest req,
                               EmergencyStatus expected, String operation) {
        if (req.getStatus() != expected) {
            throw new IllegalStateException(
                    "Cannot " + operation + " request in status " + req.getStatus()
                    + ". Expected: " + expected);
        }
    }

    private void validateTransition(EmergencyStatus from, EmergencyStatus to) {
        boolean valid = switch (from) {
            case ACCEPTED      -> to == EmergencyStatus.EN_ROUTE;
            case EN_ROUTE      -> to == EmergencyStatus.ARRIVED;
            case ARRIVED       -> to == EmergencyStatus.PATIENT_PICKED;
            case PATIENT_PICKED-> to == EmergencyStatus.COMPLETED;
            default            -> false;
        };
        if (!valid) {
            throw new IllegalStateException(
                    "Invalid status transition: " + from + " → " + to);
        }
    }
}
