package com.urbaneye.service;

import com.urbaneye.entity.WaterloggingZone;
import com.urbaneye.repository.WaterloggingZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WaterloggingService {

    private static final int EARTH_RADIUS_KM = 6371;

    private final WaterloggingZoneRepository waterloggingZoneRepository;

    public WaterloggingService(WaterloggingZoneRepository waterloggingZoneRepository) {
        this.waterloggingZoneRepository = waterloggingZoneRepository;
    }

    public List<WaterloggingZone> getActiveZones() {
        return waterloggingZoneRepository.findByActiveTrue();
    }

    /**
     * Checks if a route or point intersects with a waterlogged zone.
     * Used for Emergency Route Hazard Protection (Step 5.12).
     */
    public boolean isPointWaterlogged(double lat, double lon) {
        List<WaterloggingZone> zones = getActiveZones();
        for (WaterloggingZone zone : zones) {
            double distKm = haversine(lat, lon, zone.getLatitude(), zone.getLongitude());
            double distMeters = distKm * 1000.0;
            if (distMeters <= zone.getRadiusMeters()) {
                return true;
            }
        }
        return false;
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
