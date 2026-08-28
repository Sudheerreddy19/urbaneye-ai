package com.urbaneye.service;

import com.urbaneye.dto.WeatherDTO;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    /**
     * Provides current city weather conditions and dynamic traffic impact advisories.
     */
    public WeatherDTO getCurrentWeather() {
        return WeatherDTO.builder()
                .temperatureCelsius(27.5)
                .humidityPercentage(84)
                .rainfallMm(14.2)
                .condition("HEAVY_RAIN")
                .windSpeedKmh(22.0)
                .visibilityKm(4.5)
                .isRaining(true)
                .trafficImpactAdvisory("🌧️ Heavy Monsoon Showers: Road speeds reduced by ~25%. High risk of waterlogging in low-lying underpasses.")
                .build();
    }
}
