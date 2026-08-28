package com.urbaneye.service;

import com.urbaneye.dto.RoadSegmentDTO;
import com.urbaneye.entity.RoadSegment;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.enums.SignalState;
import com.urbaneye.entity.enums.TrafficLevel;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.RoadSegmentRepository;
import com.urbaneye.repository.TrafficSignalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TrafficService {

    private static final Logger log = LoggerFactory.getLogger(TrafficService.class);

    private final TrafficSignalRepository signalRepository;
    private final RoadSegmentRepository   roadSegmentRepository;
    private final SimpMessagingTemplate   messagingTemplate;

    public TrafficService(TrafficSignalRepository signalRepository,
                          RoadSegmentRepository roadSegmentRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.signalRepository       = signalRepository;
        this.roadSegmentRepository  = roadSegmentRepository;
        this.messagingTemplate      = messagingTemplate;
    }

    // ── Traffic Signals ───────────────────────────────────────────────────────

    public List<TrafficSignal> getAllSignals() { return signalRepository.findAll(); }

    public TrafficSignal getByCode(String code) {
        return signalRepository.findBySignalCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficSignal", "code", code));
    }

    public TrafficSignal getById(Long id) {
        return signalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrafficSignal", "id", id));
    }

    @Transactional
    public TrafficSignal updateState(Long id, SignalState newState) {
        TrafficSignal signal = getById(id);
        signal.setCurrentState(newState);
        if (newState != SignalState.FORCED_GREEN) {
            signal.setForcedGreenUntil(null);
            signal.setForcedByAmbulance(null);
        }
        TrafficSignal saved = signalRepository.save(signal);
        messagingTemplate.convertAndSend("/topic/signals",
                Map.of("signalId", signal.getSignalCode(), "state", newState.name()));
        return saved;
    }

    @Scheduled(fixedDelay = 30_000)
    @Transactional
    public void revertExpiredForcedGreenSignals() {
        List<TrafficSignal> expired = signalRepository
                .findByCurrentStateAndForcedGreenUntilBefore(SignalState.FORCED_GREEN, LocalDateTime.now());
        for (TrafficSignal s : expired) {
            s.setCurrentState(SignalState.RED);
            s.setForcedGreenUntil(null);
            s.setForcedByAmbulance(null);
            signalRepository.save(s);
            messagingTemplate.convertAndSend("/topic/signals",
                    Map.of("signalId", s.getSignalCode(), "state", "RED", "reverted", true));
            log.info("Signal {} reverted FORCED_GREEN → RED", s.getSignalCode());
        }
    }

    // ── Road Segments & Traffic Conditions ────────────────────────────────────

    public List<RoadSegmentDTO> getAllRoadSegments() {
        return roadSegmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RoadSegmentDTO getRoadSegment(Long id) {
        RoadSegment seg = roadSegmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoadSegment", "id", id));
        return mapToDTO(seg);
    }

    @Transactional
    public RoadSegmentDTO updateRoadTraffic(Long id, Double avgSpeed, Integer vehicleCount) {
        RoadSegment seg = roadSegmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoadSegment", "id", id));

        seg.setAvgSpeed(avgSpeed);
        seg.setVehicleCount(vehicleCount);

        // Calculate congestion level
        // Lower speed & higher vehicle count => higher congestion
        double congestion;
        if (avgSpeed < 10.0) {
            congestion = 85.0 + Math.min(15.0, (vehicleCount / 20.0));
        } else if (avgSpeed < 20.0) {
            congestion = 55.0 + Math.min(25.0, (vehicleCount / 30.0));
        } else if (avgSpeed < 35.0) {
            congestion = 25.0 + Math.min(25.0, (vehicleCount / 40.0));
        } else {
            congestion = Math.min(25.0, (vehicleCount / 50.0));
        }
        seg.setCongestionPercentage(Math.round(congestion * 10.0) / 10.0);

        if (congestion >= 75.0) {
            seg.setTrafficLevel(TrafficLevel.SEVERE);
        } else if (congestion >= 50.0) {
            seg.setTrafficLevel(TrafficLevel.HIGH);
        } else if (congestion >= 25.0) {
            seg.setTrafficLevel(TrafficLevel.MODERATE);
        } else {
            seg.setTrafficLevel(TrafficLevel.LOW);
        }

        RoadSegment saved = roadSegmentRepository.save(seg);
        RoadSegmentDTO dto = mapToDTO(saved);
        messagingTemplate.convertAndSend("/topic/traffic/segments", dto);
        return dto;
    }

    public Map<String, Object> getDensitySummary() {
        long total  = signalRepository.count();
        long red    = signalRepository.findByCurrentState(SignalState.RED).size();
        long green  = signalRepository.findByCurrentState(SignalState.GREEN).size();
        long forced = signalRepository.findByCurrentState(SignalState.FORCED_GREEN).size();
        long yellow = signalRepository.findByCurrentState(SignalState.YELLOW).size();
        double pct  = total > 0 ? (red * 100.0 / total) : 0;
        String level = pct < 25 ? "LOW" : pct < 50 ? "MODERATE" : pct < 75 ? "HIGH" : "SEVERE";

        long severeSegments = roadSegmentRepository.findByTrafficLevel(TrafficLevel.SEVERE).size();
        long highSegments   = roadSegmentRepository.findByTrafficLevel(TrafficLevel.HIGH).size();

        return Map.of("totalSignals", total, "red", red, "green", green,
                "yellow", yellow, "forcedGreen", forced,
                "congestionPct", Math.round(pct), "level", level,
                "severeCorridors", severeSegments, "highCorridors", highSegments);
    }

    private RoadSegmentDTO mapToDTO(RoadSegment seg) {
        return RoadSegmentDTO.builder()
                .id(seg.getId())
                .roadName(seg.getRoadName())
                .startLat(seg.getStartLat())
                .startLon(seg.getStartLon())
                .endLat(seg.getEndLat())
                .endLon(seg.getEndLon())
                .avgSpeed(seg.getAvgSpeed())
                .vehicleCount(seg.getVehicleCount())
                .trafficLevel(seg.getTrafficLevel())
                .congestionPercentage(seg.getCongestionPercentage())
                .lastUpdated(seg.getLastUpdated())
                .build();
    }
}
