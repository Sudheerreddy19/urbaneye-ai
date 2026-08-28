package com.urbaneye.websocket;

import com.urbaneye.dto.AmbulanceLocationDTO;
import com.urbaneye.dto.BusLocationDTO;
import com.urbaneye.service.AmbulanceService;
import com.urbaneye.service.BusService;
import com.urbaneye.service.GreenCorridorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class LocationWebSocket {

    private static final Logger log = LoggerFactory.getLogger(LocationWebSocket.class);

    private final AmbulanceService     ambulanceService;
    private final BusService           busService;
    private final GreenCorridorService greenCorridorService;
    private final SimpMessagingTemplate messagingTemplate;

    public LocationWebSocket(AmbulanceService ambulanceService,
                             BusService busService,
                             GreenCorridorService greenCorridorService,
                             SimpMessagingTemplate messagingTemplate) {
        this.ambulanceService     = ambulanceService;
        this.busService           = busService;
        this.greenCorridorService = greenCorridorService;
        this.messagingTemplate    = messagingTemplate;
    }

    @MessageMapping("/location/ambulance")
    public void handleAmbulanceLocation(AmbulanceLocationDTO dto) {
        try {
            ambulanceService.updateLocation(dto);
            if ("EMERGENCY".equals(dto.getStatus())) {
                greenCorridorService.activateGreenCorridor(dto.getAmbulanceId());
            }
        } catch (Exception e) {
            log.error("Ambulance location error for {}: {}", dto.getAmbulanceId(), e.getMessage());
        }
    }

    @MessageMapping("/location/bus")
    public void handleBusLocation(BusLocationDTO dto) {
        try {
            busService.updateLocation(dto);
        } catch (Exception e) {
            log.error("Bus location error for {}: {}", dto.getBusId(), e.getMessage());
        }
    }
}
