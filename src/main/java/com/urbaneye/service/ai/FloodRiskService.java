package com.urbaneye.service.ai;

import com.urbaneye.dto.ai.FloodRiskDTO;
import com.urbaneye.entity.WaterloggingZone;
import com.urbaneye.repository.WaterloggingZoneRepository;
import com.urbaneye.service.WeatherService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FloodRiskService {

    private final WaterloggingZoneRepository waterloggingZoneRepository;
    private final WeatherService             weatherService;

    public FloodRiskService(WaterloggingZoneRepository waterloggingZoneRepository,
                            WeatherService weatherService) {
        this.waterloggingZoneRepository = waterloggingZoneRepository;
        this.weatherService             = weatherService;
    }

    public List<FloodRiskDTO> predictFloodRisks() {
        boolean isRaining = weatherService.getCurrentWeather().getIsRaining();
        List<WaterloggingZone> zones = waterloggingZoneRepository.findByActiveTrue();
        List<FloodRiskDTO> dtos = new ArrayList<>();

        for (WaterloggingZone z : zones) {
            int curDepth = z.getDepthCm() != null ? z.getDepthCm() : 25;
            int predDepth = isRaining ? (curDepth + 15) : Math.max(5, curDepth - 10);
            String risk = predDepth >= 45 ? "CRITICAL" : predDepth >= 30 ? "HIGH" : predDepth >= 15 ? "MODERATE" : "LOW";
            boolean isSafe = predDepth < 40;

            String altCorridor = !isSafe ? "Divert traffic via Brodipet Overpass & Ring Road North" : "Direct access operational";

            dtos.add(FloodRiskDTO.builder()
                    .zoneName(z.getZoneName())
                    .latitude(z.getLatitude())
                    .longitude(z.getLongitude())
                    .riskLevel(risk)
                    .currentWaterDepthCm(curDepth)
                    .predicted30MinDepthCm(predDepth)
                    .isSafeForEmergencyVehicles(isSafe)
                    .recommendedAlternateCorridor(altCorridor)
                    .build());
        }

        return dtos;
    }
}
