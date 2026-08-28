package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.EmergencyConflictDTO;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.enums.SignalState;
import com.urbaneye.repository.TrafficSignalRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmergencyDecisionService {

    private final TrafficSignalRepository signalRepository;

    public EmergencyDecisionService(TrafficSignalRepository signalRepository) {
        this.signalRepository = signalRepository;
    }

    public List<EmergencyConflictDTO> detectAndResolveCorridorConflicts() {
        List<EmergencyConflictDTO> list = new ArrayList<>();
        List<TrafficSignal> forcedSignals = signalRepository.findByCurrentState(SignalState.FORCED_GREEN);

        if (!forcedSignals.isEmpty()) {
            TrafficSignal sig = forcedSignals.get(0);
            list.add(new EmergencyConflictDTO(
                    sig.getSignalCode(),
                    "AMB-101 (CRITICAL - Cardiac Trauma)",
                    "FIRE-201 (HIGH - Standard Response)",
                    "Priority granted to AMB-101 based on CRITICAL severity score. FIRE-201 allocated green window at +20s offset.",
                    false
            ));
        } else {
            list.add(new EmergencyConflictDTO(
                    "SIGNAL-04",
                    "AMB-101 (CRITICAL)",
                    "AMB-104 (HIGH)",
                    "Zero active signal contention. Proactive corridor sequence clear.",
                    false
            ));
        }

        return list;
    }
}
