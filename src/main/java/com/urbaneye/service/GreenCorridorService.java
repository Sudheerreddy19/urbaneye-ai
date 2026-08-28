package com.urbaneye.service;

import com.urbaneye.dto.CorridorSignalStatusDTO;
import com.urbaneye.dto.GreenCorridorStatusDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.GreenCorridor;
import com.urbaneye.entity.SignalEvent;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.enums.AmbulanceStatus;
import com.urbaneye.entity.enums.SignalState;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.AmbulanceRepository;
import com.urbaneye.repository.GreenCorridorRepository;
import com.urbaneye.repository.SignalEventRepository;
import com.urbaneye.repository.TrafficSignalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GreenCorridorService {

    private static final Logger log = LoggerFactory.getLogger(GreenCorridorService.class);

    private static final double GEOFENCE_TRIGGER_RADIUS_KM = 0.300; // 300 meters
    private static final double GEOFENCE_RELEASE_RADIUS_KM = 0.380; // 380 meters (passed)
    private static final int    SAFETY_TIMEOUT_SECONDS     = 45;    // 45s safety timeout
    private static final int    EARTH_RADIUS_KM            = 6371;

    private final AmbulanceRepository     ambulanceRepository;
    private final TrafficSignalRepository signalRepository;
    private final GreenCorridorRepository greenCorridorRepository;
    private final SignalEventRepository   signalEventRepository;
    private final SimpMessagingTemplate   messagingTemplate;

    public GreenCorridorService(AmbulanceRepository ambulanceRepository,
                                TrafficSignalRepository signalRepository,
                                GreenCorridorRepository greenCorridorRepository,
                                SignalEventRepository signalEventRepository,
                                SimpMessagingTemplate messagingTemplate) {
        this.ambulanceRepository    = ambulanceRepository;
        this.signalRepository       = signalRepository;
        this.greenCorridorRepository = greenCorridorRepository;
        this.signalEventRepository  = signalEventRepository;
        this.messagingTemplate      = messagingTemplate;
    }

    /**
     * Core Geofencing & Preemption Algorithm — Step 5 & 8
     *
     * Evaluates ambulance proximity on every GPS tick.
     * 1. If distance <= 300m -> Preempt signal to FORCED_GREEN.
     * 2. If ambulance moved past (> 380m) -> Release signal back to normal cycle.
     */
    @Transactional
    public void processAmbulanceMovement(String ambulanceNumber, double lat, double lon, double speed) {
        // 1. Check all signals
        List<TrafficSignal> allSignals = signalRepository.findAll();
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(SAFETY_TIMEOUT_SECONDS);

        for (TrafficSignal signal : allSignals) {
            double distKm = haversine(lat, lon, signal.getLatitude(), signal.getLongitude());
            long distMeters = Math.round(distKm * 1000.0);

            // Case A: Within 300m Geofence -> Trigger FORCED_GREEN
            if (distKm <= GEOFENCE_TRIGGER_RADIUS_KM) {
                if (signal.getCurrentState() != SignalState.FORCED_GREEN ||
                    !ambulanceNumber.equals(signal.getForcedByAmbulance())) {

                    String prevState = signal.getCurrentState().name();
                    signal.setCurrentState(SignalState.FORCED_GREEN);
                    signal.setForcedGreenUntil(expiresAt);
                    signal.setForcedByAmbulance(ambulanceNumber);
                    signalRepository.save(signal);

                    // Record Audit Event
                    SignalEvent event = SignalEvent.builder()
                            .signalCode(signal.getSignalCode())
                            .ambulanceNumber(ambulanceNumber)
                            .eventType("PREEMPTION_TRIGGERED")
                            .previousState(prevState)
                            .newState("FORCED_GREEN")
                            .distanceMeters(distMeters)
                            .message("Ambulance " + ambulanceNumber + " entered 300m zone (" + distMeters + "m). Signal preempted to FORCED_GREEN.")
                            .build();
                    signalEventRepository.save(event);

                    log.info("🚦 GEOFENCE PREEMPTION [300m]: {} → FORCED_GREEN (Distance: {}m, Ambulance: {})",
                            signal.getSignalCode(), distMeters, ambulanceNumber);

                    // Broadcast STOMP event
                    broadcastSignalEvent(signal, ambulanceNumber, distMeters, "FORCED_GREEN", "PREEMPTION_TRIGGERED");
                }
            }
            // Case B: Ambulance has passed (> 380m) and signal was forced by this ambulance -> Release back to RED
            else if (distKm > GEOFENCE_RELEASE_RADIUS_KM &&
                     signal.getCurrentState() == SignalState.FORCED_GREEN &&
                     ambulanceNumber.equals(signal.getForcedByAmbulance())) {

                signal.setCurrentState(SignalState.RED);
                signal.setForcedGreenUntil(null);
                signal.setForcedByAmbulance(null);
                signalRepository.save(signal);

                SignalEvent event = SignalEvent.builder()
                        .signalCode(signal.getSignalCode())
                        .ambulanceNumber(ambulanceNumber)
                        .eventType("SIGNAL_RELEASED")
                        .previousState("FORCED_GREEN")
                        .newState("RED")
                        .distanceMeters(distMeters)
                        .message("Ambulance " + ambulanceNumber + " passed signal (" + distMeters + "m). Reverted to normal cycle.")
                        .build();
                signalEventRepository.save(event);

                log.info("🚦 GEOFENCE RELEASE: {} → RED (Ambulance {} passed, Distance: {}m)",
                        signal.getSignalCode(), ambulanceNumber, distMeters);

                broadcastSignalEvent(signal, ambulanceNumber, distMeters, "RED", "SIGNAL_RELEASED");
            }
        }
    }

    /**
     * Manual or Dispatch-driven Green Corridor activation.
     */
    @Transactional
    public List<Map<String, Object>> activateGreenCorridor(String ambulanceNumber) {
        Ambulance ambulance = ambulanceRepository.findByAmbulanceNumber(ambulanceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance", "number", ambulanceNumber));

        ambulance.setStatus(AmbulanceStatus.EMERGENCY);
        ambulanceRepository.save(ambulance);

        // Register active GreenCorridor if not existing
        GreenCorridor corridor = greenCorridorRepository.findByAmbulanceNumberAndStatus(ambulanceNumber, "ACTIVE")
                .orElseGet(() -> greenCorridorRepository.save(GreenCorridor.builder()
                        .corridorCode("GC-" + ambulanceNumber)
                        .name("Express Emergency Corridor for " + ambulanceNumber)
                        .ambulanceNumber(ambulanceNumber)
                        .destinationHospital(ambulance.getHospital())
                        .status("ACTIVE")
                        .totalSignals(4)
                        .signalsCleared(0)
                        .build()));

        if (ambulance.getLatitude() != null && ambulance.getLongitude() != null) {
            processAmbulanceMovement(ambulanceNumber, ambulance.getLatitude(), ambulance.getLongitude(), ambulance.getSpeed());
        }

        List<TrafficSignal> nearby = signalRepository.findSignalsNearLocation(
                ambulance.getLatitude(), ambulance.getLongitude(), GEOFENCE_TRIGGER_RADIUS_KM);

        List<Map<String, Object>> events = new ArrayList<>();
        for (TrafficSignal signal : nearby) {
            double distM = haversine(ambulance.getLatitude(), ambulance.getLongitude(),
                    signal.getLatitude(), signal.getLongitude()) * 1000;
            events.add(Map.of(
                    "signalId",       signal.getSignalCode(),
                    "state",          signal.getCurrentState().name(),
                    "ambulanceId",    ambulanceNumber,
                    "distanceMeters", Math.round(distM),
                    "zone",           signal.getZone() != null ? signal.getZone() : "Corridor"
            ));
        }

        log.info("🚨 Emergency Green Corridor ACTIVE for {} (Corridor {})", ambulanceNumber, corridor.getCorridorCode());
        return events;
    }

    @Transactional
    public void deactivateGreenCorridor(String ambulanceNumber) {
        greenCorridorRepository.findByAmbulanceNumberAndStatus(ambulanceNumber, "ACTIVE")
                .ifPresent(gc -> {
                    gc.setStatus("COMPLETED");
                    gc.setCompletedAt(LocalDateTime.now());
                    greenCorridorRepository.save(gc);
                });

        // Revert any remaining forced signals
        List<TrafficSignal> forced = signalRepository.findByCurrentState(SignalState.FORCED_GREEN);
        for (TrafficSignal s : forced) {
            if (ambulanceNumber.equals(s.getForcedByAmbulance())) {
                s.setCurrentState(SignalState.RED);
                s.setForcedGreenUntil(null);
                s.setForcedByAmbulance(null);
                signalRepository.save(s);
                broadcastSignalEvent(s, ambulanceNumber, 0L, "RED", "CORRIDOR_DEACTIVATED");
            }
        }
        log.info("Green corridor deactivated for {}", ambulanceNumber);
    }

    /**
     * Safety timeout: Reverts any orphaned FORCED_GREEN signals.
     */
    @Scheduled(fixedDelay = 10_000)
    @Transactional
    public void revertExpiredForcedGreenSignals() {
        List<TrafficSignal> expired = signalRepository
                .findByCurrentStateAndForcedGreenUntilBefore(SignalState.FORCED_GREEN, LocalDateTime.now());

        for (TrafficSignal s : expired) {
            String amb = s.getForcedByAmbulance() != null ? s.getForcedByAmbulance() : "UNKNOWN";
            s.setCurrentState(SignalState.RED);
            s.setForcedGreenUntil(null);
            s.setForcedByAmbulance(null);
            signalRepository.save(s);

            SignalEvent event = SignalEvent.builder()
                    .signalCode(s.getSignalCode())
                    .ambulanceNumber(amb)
                    .eventType("TIMEOUT_EXPIRED")
                    .previousState("FORCED_GREEN")
                    .newState("RED")
                    .distanceMeters(0L)
                    .message("Safety timeout expired for " + s.getSignalCode() + ". Reset to normal cycle.")
                    .build();
            signalEventRepository.save(event);

            log.info("🚦 SAFETY TIMEOUT RESET: {} → RED (Expired)", s.getSignalCode());
            broadcastSignalEvent(s, amb, 0L, "RED", "TIMEOUT_EXPIRED");
        }
    }

    /**
     * Rich corridor status for police & user dashboards.
     */
    public GreenCorridorStatusDTO getCorridorStatus(String ambulanceNumber) {
        Ambulance amb = ambulanceRepository.findByAmbulanceNumber(ambulanceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance", "number", ambulanceNumber));

        List<TrafficSignal> allSignals = signalRepository.findAll();
        List<CorridorSignalStatusDTO> signalDTOs = new ArrayList<>();

        String nextSignalCode = null;
        Long nextSignalDist = Long.MAX_VALUE;
        int forcedCount = 0;

        for (TrafficSignal s : allSignals) {
            double distKm = haversine(amb.getLatitude(), amb.getLongitude(), s.getLatitude(), s.getLongitude());
            long distM = Math.round(distKm * 1000.0);
            boolean isForced = s.getCurrentState() == SignalState.FORCED_GREEN;
            if (isForced) forcedCount++;

            if (distM < nextSignalDist && distM > 50) {
                nextSignalDist = distM;
                nextSignalCode = s.getSignalCode();
            }

            signalDTOs.add(CorridorSignalStatusDTO.builder()
                    .signalCode(s.getSignalCode())
                    .zone(s.getZone())
                    .latitude(s.getLatitude())
                    .longitude(s.getLongitude())
                    .currentState(s.getCurrentState().name())
                    .distanceMeters(distM)
                    .isForcedGreen(isForced)
                    .isUpcoming(distM > 0 && distM <= 800)
                    .isPassed(distM > 800)
                    .build());
        }

        signalDTOs.sort(Comparator.comparingLong(CorridorSignalStatusDTO::getDistanceMeters));

        return GreenCorridorStatusDTO.builder()
                .corridorCode("GC-" + ambulanceNumber)
                .name("Guntur Emergency Trauma Corridor")
                .ambulanceNumber(ambulanceNumber)
                .destinationHospitalName(amb.getHospital() != null ? amb.getHospital().getName() : "Guntur Government Hospital")
                .status(amb.getStatus() == AmbulanceStatus.EMERGENCY ? "ACTIVE" : "STANDBY")
                .nextSignalCode(nextSignalCode != null ? nextSignalCode : "SIGNAL-01")
                .nextSignalDistanceMeters(nextSignalDist != Long.MAX_VALUE ? nextSignalDist : 350L)
                .activeForcedGreenCount(forcedCount)
                .signals(signalDTOs)
                .build();
    }

    public List<TrafficSignal> getActiveCorridors() {
        return signalRepository.findByCurrentState(SignalState.FORCED_GREEN);
    }

    public List<SignalEvent> getRecentEvents() {
        return signalEventRepository.findTop20ByOrderByCreatedAtDesc();
    }

    private void broadcastSignalEvent(TrafficSignal signal, String ambulanceNumber, long distMeters, String state, String eventType) {
        Map<String, Object> payload = Map.of(
                "signalId",       signal.getSignalCode(),
                "state",          state,
                "ambulanceId",    ambulanceNumber,
                "distanceMeters", distMeters,
                "eventType",      eventType,
                "zone",           signal.getZone() != null ? signal.getZone() : "Corridor",
                "timestamp",      System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend("/topic/signals", payload);
        messagingTemplate.convertAndSend("/topic/police/corridor", payload);
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2)*Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))*Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2)*Math.sin(dLon/2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}
