package com.urbaneye.simulation;

import com.urbaneye.dto.BusLocationDTO;
import com.urbaneye.service.BusService;
import com.urbaneye.service.TrafficService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 🚌 Real-time Public Transit Bus Simulator
 *
 * Simulates Bus 21A moving along the Guntur → Amaravati corridor:
 *   Stop 1: Guntur Bus Stand          16.3080, 80.4380
 *   Stop 2: Lakshmipuram Junction     16.3120, 80.4420
 *   Stop 3: Brodipet Center           16.3150, 80.4450
 *   Stop 4: Metro Wholesale Market    16.3200, 80.4500
 *   Stop 5: Amaravati North           16.3300, 80.4600
 *
 * Broadcasts location + occupancy to /topic/buses every 5 seconds.
 */
@Component
public class BusSimulator {

    private static final Logger log = LoggerFactory.getLogger(BusSimulator.class);

    private static final String BUS_ID_1 = "21A";
    private static final String BUS_ID_2 = "14B";

    /** Coordinates & passenger count waypoints for Bus 21A */
    private static final double[][] WAYPOINTS_21A = {
        {16.3080, 80.4380, 20.0, 36.0}, // Guntur Bus Stand
        {16.3100, 80.4400, 35.0, 38.0}, // En route
        {16.3120, 80.4420, 15.0, 42.0}, // Lakshmipuram (crowding)
        {16.3135, 80.4435, 30.0, 40.0},
        {16.3150, 80.4450, 22.0, 44.0}, // Brodipet
        {16.3180, 80.4480, 40.0, 39.0},
        {16.3200, 80.4500, 10.0, 35.0}, // Metro Wholesale
        {16.3250, 80.4550, 45.0, 30.0},
        {16.3300, 80.4600, 0.0,  15.0}  // Amaravati Terminus
    };

    /** Coordinates for Bus 14B */
    private static final double[][] WAYPOINTS_14B = {
        {16.3120, 80.4420, 45.0, 28.0},
        {16.3150, 80.4460, 42.0, 31.0},
        {16.3180, 80.4500, 38.0, 35.0},
        {16.3220, 80.4550, 48.0, 25.0}
    };

    private int step21A = 0;
    private boolean forward21A = true;

    private int step14B = 0;
    private boolean forward14B = true;

    private final BusService busService;

    public BusSimulator(BusService busService) {
        this.busService = busService;
    }

    @Scheduled(fixedDelay = 5000)
    public void tick() {
        simulateBus21A();
        simulateBus14B();
    }

    private void simulateBus21A() {
        double[] wp = WAYPOINTS_21A[step21A];

        BusLocationDTO dto = new BusLocationDTO();
        dto.setBusId(BUS_ID_1);
        dto.setLatitude(wp[0]);
        dto.setLongitude(wp[1]);
        dto.setSpeed(wp[2]);
        dto.setPassengers((int) wp[3]);
        dto.setStatus("ACTIVE");
        dto.setTimestamp(System.currentTimeMillis());

        try {
            busService.updateLocation(dto);
        } catch (Exception e) {
            log.debug("Bus 21A tick skipped: {}", e.getMessage());
            return;
        }

        if (forward21A) {
            step21A++;
            if (step21A >= WAYPOINTS_21A.length) {
                step21A = WAYPOINTS_21A.length - 2;
                forward21A = false;
            }
        } else {
            step21A--;
            if (step21A < 0) {
                step21A = 1;
                forward21A = true;
            }
        }
    }

    private void simulateBus14B() {
        double[] wp = WAYPOINTS_14B[step14B];

        BusLocationDTO dto = new BusLocationDTO();
        dto.setBusId(BUS_ID_2);
        dto.setLatitude(wp[0]);
        dto.setLongitude(wp[1]);
        dto.setSpeed(wp[2]);
        dto.setPassengers((int) wp[3]);
        dto.setStatus("ACTIVE");
        dto.setTimestamp(System.currentTimeMillis());

        try {
            busService.updateLocation(dto);
        } catch (Exception e) {
            log.debug("Bus 14B tick skipped: {}", e.getMessage());
            return;
        }

        if (forward14B) {
            step14B++;
            if (step14B >= WAYPOINTS_14B.length) {
                step14B = WAYPOINTS_14B.length - 2;
                forward14B = false;
            }
        } else {
            step14B--;
            if (step14B < 0) {
                step14B = 1;
                forward14B = true;
            }
        }
    }
}
