package com.urbaneye.websocket;

import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.service.GreenCorridorService;
import com.urbaneye.service.TrafficService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SignalWebSocket {

    private static final Logger log = LoggerFactory.getLogger(SignalWebSocket.class);

    private final GreenCorridorService  greenCorridorService;
    private final TrafficService        trafficService;
    private final SimpMessagingTemplate messagingTemplate;

    public SignalWebSocket(GreenCorridorService greenCorridorService,
                           TrafficService trafficService,
                           SimpMessagingTemplate messagingTemplate) {
        this.greenCorridorService = greenCorridorService;
        this.trafficService       = trafficService;
        this.messagingTemplate    = messagingTemplate;
    }

    @MessageMapping("/signals/request-green-corridor")
    public void requestGreenCorridor(Map<String, String> payload) {
        String ambulanceNumber = payload.get("ambulanceNumber");
        try {
            List<Map<String, Object>> events = greenCorridorService.activateGreenCorridor(ambulanceNumber);
            log.info("Green corridor WebSocket for {}: {} signals", ambulanceNumber, events.size());
        } catch (Exception e) {
            log.error("Green corridor failed for {}: {}", ambulanceNumber, e.getMessage());
            Map<String, Object> err = new HashMap<>();
            err.put("error", e.getMessage());
            err.put("ambulanceId", ambulanceNumber);
            messagingTemplate.convertAndSend("/topic/signals", err);
        }
    }

    @MessageMapping("/signals/refresh")
    public void refreshSignals() {
        List<TrafficSignal> signals = trafficService.getAllSignals();
        messagingTemplate.convertAndSend("/topic/signals/snapshot", signals);
    }
}
