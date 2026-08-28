package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.HospitalOptionDTO;
import com.urbaneye.dto.ai.HospitalRecommendationDTO;
import com.urbaneye.entity.Hospital;
import com.urbaneye.repository.HospitalRepository;
import com.urbaneye.service.WaterloggingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class HospitalRecommendationService {

    private static final int EARTH_RADIUS_KM = 6371;

    private final HospitalRepository hospitalRepository;
    private final WaterloggingService waterloggingService;

    public HospitalRecommendationService(HospitalRepository hospitalRepository,
                                         WaterloggingService waterloggingService) {
        this.hospitalRepository = hospitalRepository;
        this.waterloggingService = waterloggingService;
    }

    public HospitalRecommendationDTO recommendHospital(double patientLat, double patientLon, String severity, boolean requiresIcu) {
        List<Hospital> hospitals = hospitalRepository.findAll();
        List<HospitalOptionDTO> options = new ArrayList<>();

        for (Hospital h : hospitals) {
            double distKm = haversine(patientLat, patientLon, h.getLatitude(), h.getLongitude());
            int eta = (int) Math.ceil((distKm / 40.0) * 60.0);
            boolean waterloggedRoute = waterloggingService.isPointWaterlogged(h.getLatitude(), h.getLongitude());

            List<String> reasons = new ArrayList<>();
            double score = 100.0 - (eta * 2.5);

            if (h.getAvailableIcuBeds() > 0) {
                reasons.add("✓ " + h.getAvailableIcuBeds() + " ICU beds available");
                score += 15.0;
            } else if (requiresIcu) {
                reasons.add("⚠ ICU capacity currently constrained");
                score -= 40.0;
            }

            if (h.getEmergencyRoomAvailable()) {
                reasons.add("✓ Emergency trauma department ready");
            } else {
                reasons.add("✕ Emergency triage diverts active");
                score -= 50.0;
            }

            if (waterloggedRoute) {
                reasons.add("⚠ Flood waterlogging near approach underpass");
                score -= 20.0;
            } else {
                reasons.add("✓ Clean flood-free access corridor");
            }

            if (h.getBloodUnits() != null && h.getBloodUnits() >= 15) {
                reasons.add("✓ Adequate blood bank reserves (" + h.getBloodUnits() + " units)");
            }

            options.add(HospitalOptionDTO.builder()
                    .hospitalId(h.getId())
                    .hospitalName(h.getName())
                    .distanceKm(Math.round(distKm * 10.0) / 10.0)
                    .etaMinutes(Math.max(2, eta))
                    .availableIcuBeds(h.getAvailableIcuBeds())
                    .availableGeneralBeds(h.getAvailableBeds())
                    .bloodUnits(h.getBloodUnits() != null ? h.getBloodUnits() : 20)
                    .trafficCondition(distKm < 3.0 ? "MODERATE" : "LOW")
                    .hasWaterloggingOnRoute(waterloggedRoute)
                    .matchScore(Math.max(10.0, Math.min(100.0, score)))
                    .reasons(reasons)
                    .build());
        }

        options.sort(Comparator.comparingDouble(HospitalOptionDTO::getMatchScore).reversed());
        HospitalOptionDTO best = options.isEmpty() ? null : options.get(0);

        List<HospitalOptionDTO> finalOptions = new ArrayList<>();
        for (HospitalOptionDTO opt : options) {
            boolean isRec = best != null && opt.getHospitalId().equals(best.getHospitalId());
            finalOptions.add(HospitalOptionDTO.builder()
                    .hospitalId(opt.getHospitalId())
                    .hospitalName(opt.getHospitalName())
                    .distanceKm(opt.getDistanceKm())
                    .etaMinutes(opt.getEtaMinutes())
                    .availableIcuBeds(opt.getAvailableIcuBeds())
                    .availableGeneralBeds(opt.getAvailableGeneralBeds())
                    .bloodUnits(opt.getBloodUnits())
                    .trafficCondition(opt.getTrafficCondition())
                    .hasWaterloggingOnRoute(opt.getHasWaterloggingOnRoute())
                    .isRecommended(isRec)
                    .matchScore(opt.getMatchScore())
                    .reasons(opt.getReasons())
                    .build());
        }

        String summary = best != null
                ? "⭐ Recommended " + best.getHospitalName() + ": Optimal balance of rapid ETA (" + best.getEtaMinutes() + " min), available ICU capacity (" + best.getAvailableIcuBeds() + " beds), and clear green corridors."
                : "No matching hospital available";

        return new HospitalRecommendationDTO(best != null ? best.getHospitalName() : "N/A", summary, finalOptions);
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
