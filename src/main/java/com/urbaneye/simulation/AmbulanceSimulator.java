package com.urbaneye.simulation;

import com.urbaneye.dto.AmbulanceLocationDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.service.AmbulanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 🚑 Ambulance GPS Simulator — Phase 4 Green Corridor Demo
 *
 * Simulates AMB-101 moving along the Guntur Green Corridor waypoints.
 * When in EMERGENCY mode, as it gets within 300m of SIGNAL-01, SIGNAL-02, SIGNAL-03,
 * the signals automatically switch to FORCED_GREEN and revert to RED after it passes!
 *
 * Route (Guntur city center → Government Hospital area):
 *   A  16.3050, 80.4320 (Stationary)
 *   B  16.3065, 80.4345 (Approach Signal-05)
 *   C  16.3075, 80.4375 (Signal-01 Junction)
 *   D  16.3085, 80.4385 (Signal-02 Junction)
 *   E  16.3095, 80.4395 (Signal-03 Junction)
 *   F  16.3067, 80.4365 (Government Hospital Arrival)
 */
@Component
public class AmbulanceSimulator {

    private static final Logger log = LoggerFactory.getLogger(AmbulanceSimulator.class);

    private static final String AMBULANCE_ID = "AMB-101";

    /** 10 real Guntur coordinates mapped close to traffic signals */
    private static final double[][] WAYPOINTS = {
        {16.3050, 80.4320, 0.0},    // A — starting point
        {16.3060, 80.4340, 42.0},   // B — speeding up
        {16.3072, 80.4365, 48.0},   // C — entering 300m of SIGNAL-01
        {16.3075, 80.4375, 52.0},   // D — at SIGNAL-01 (FORCED_GREEN)
        {16.3082, 80.4382, 45.0},   // E — leaving SIGNAL-01, entering SIGNAL-02 (300m)
        {16.3085, 80.4385, 50.0},   // F — at SIGNAL-02 (FORCED_GREEN)
        {16.3092, 80.4392, 48.0},   // G — leaving SIGNAL-02, entering SIGNAL-03 (300m)
        {16.3095, 80.4395, 50.0},   // H — at SIGNAL-03 (FORCED_GREEN)
        {16.3080, 80.4380, 35.0},   // I — turning to Hospital
        {16.3067, 80.4365, 0.0},    // J — Government Hospital Destination
    };

    private int  currentWaypoint = 0;
    private boolean forward      = true;

    private final AmbulanceService ambulanceService;

    public AmbulanceSimulator(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    /**
     * Every 4 seconds: move AMB-101 to the next waypoint, persist to DB,
     * and broadcast via WebSocket to all connected dashboards.
     */
    @Scheduled(fixedDelay = 4000)
    public void tick() {
        double[] wp = WAYPOINTS[currentWaypoint];

        String currentStatus = "AVAILABLE";
        try {
            Ambulance amb = ambulanceService.getByAmbulanceNumber(AMBULANCE_ID);
            currentStatus = amb.getStatus().name();
        } catch (Exception ignored) {}

        AmbulanceLocationDTO dto = new AmbulanceLocationDTO();
        dto.setAmbulanceId(AMBULANCE_ID);
        dto.setLatitude(wp[0]);
        dto.setLongitude(wp[1]);
        dto.setSpeed(wp[2]);
        dto.setStatus(currentStatus);
        dto.setTimestamp(System.currentTimeMillis());

        try {
            ambulanceService.updateLocation(dto); // triggers 300m geofence evaluation if EMERGENCY
        } catch (Exception e) {
            log.debug("Simulator tick skipped: {}", e.getMessage());
            return;
        }

        log.debug("🚑 AMB-101 @ Waypoint {} [{}, {}] speed: {} km/h ({})",
                currentWaypoint, wp[0], wp[1], wp[2], currentStatus);

        if (forward) {
            currentWaypoint++;
            if (currentWaypoint >= WAYPOINTS.length) {
                currentWaypoint = WAYPOINTS.length - 2;
                forward = false;
            }
        } else {
            currentWaypoint--;
            if (currentWaypoint < 0) {
                currentWaypoint = 1;
                forward = true;
            }
        }
    }
}
