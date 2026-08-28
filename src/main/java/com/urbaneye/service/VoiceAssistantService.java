package com.urbaneye.service;

import com.urbaneye.dto.BusDetailsDTO;
import com.urbaneye.dto.VoiceQueryRequest;
import com.urbaneye.dto.VoiceQueryResponse;
import com.urbaneye.dto.WeatherDTO;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.Hospital;
import com.urbaneye.entity.RoadSegment;
import com.urbaneye.entity.WaterloggingZone;
import com.urbaneye.repository.HospitalRepository;
import com.urbaneye.repository.RoadSegmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 🤖 UrbanEye Voice AI Intent Parser & Assistant Service
 *
 * Maps spoken speech-to-text queries from Web Speech API into structured
 * action responses, conversational speech text, and map layer directives.
 */
@Service
public class VoiceAssistantService {

    private final BusService           busService;
    private final AmbulanceService     ambulanceService;
    private final WeatherService       weatherService;
    private final WaterloggingService  waterloggingService;
    private final RoadSegmentRepository roadSegmentRepository;
    private final HospitalRepository   hospitalRepository;

    public VoiceAssistantService(BusService busService,
                                 AmbulanceService ambulanceService,
                                 WeatherService weatherService,
                                 WaterloggingService waterloggingService,
                                 RoadSegmentRepository roadSegmentRepository,
                                 HospitalRepository hospitalRepository) {
        this.busService             = busService;
        this.ambulanceService       = ambulanceService;
        this.weatherService         = weatherService;
        this.waterloggingService    = waterloggingService;
        this.roadSegmentRepository  = roadSegmentRepository;
        this.hospitalRepository     = hospitalRepository;
    }

    public VoiceQueryResponse processQuery(VoiceQueryRequest request) {
        String q = request.getQuery() != null ? request.getQuery().toLowerCase().trim() : "";
        double lat = request.getUserLat() != null ? request.getUserLat() : 16.3080;
        double lon = request.getUserLon() != null ? request.getUserLon() : 80.4380;

        // 1. Bus Location / Status (e.g. "where is bus 21a", "track bus 14b")
        if (q.contains("bus")) {
            String busNum = extractBusNumber(q);
            try {
                BusDetailsDTO details = busService.getDetails(busNum, lat, lon);
                String spoken = String.format("Bus %s is %s kilometers away on route %s. Estimated arrival is %d minutes. Current occupancy is %d percent, which is %s.",
                        details.getBusNumber(),
                        details.getDistanceKm(),
                        details.getRouteName(),
                        details.getEtaMinutes(),
                        Math.round(details.getOccupancyPercentage()),
                        details.getOccupancyLevel());

                return VoiceQueryResponse.builder()
                        .intent("BUS_LOCATION")
                        .spokenResponse(spoken)
                        .actionDirective("FOCUS_BUS_" + busNum)
                        .data(details)
                        .build();
            } catch (Exception e) {
                List<Bus> allBuses = busService.getAll();
                return VoiceQueryResponse.builder()
                        .intent("BUS_LIST")
                        .spokenResponse("There are " + allBuses.size() + " active buses operating across the city corridors.")
                        .actionDirective("SHOW_BUSES_LAYER")
                        .data(allBuses)
                        .build();
            }
        }

        // 2. Waterlogging / Flooded roads (e.g. "show flooded roads", "waterlogging near me")
        if (q.contains("flood") || q.contains("waterlog") || q.contains("water") || q.contains("rain road")) {
            List<WaterloggingZone> zones = waterloggingService.getActiveZones();
            String spoken = String.format("Showing %d active waterlogged zones. Caution advised near Lakshmipuram Underpass and Brodipet Low Area.", zones.size());
            return VoiceQueryResponse.builder()
                    .intent("WATERLOGGING")
                    .spokenResponse(spoken)
                    .actionDirective("ENABLE_WATERLOGGING_LAYER")
                    .data(zones)
                    .build();
        }

        // 3. Traffic / Congestion (e.g. "how is traffic on mg road", "traffic status")
        if (q.contains("traffic") || q.contains("jam") || q.contains("congestion") || q.contains("road")) {
            Optional<RoadSegment> mgRoad = roadSegmentRepository.findByRoadName("MG Road");
            if (q.contains("mg") && mgRoad.isPresent()) {
                RoadSegment r = mgRoad.get();
                String spoken = String.format("MG Road currently has %s traffic with an average speed of %.1f kilometers per hour and %d percent congestion.",
                        r.getTrafficLevel().name(), r.getAvgSpeed(), Math.round(r.getCongestionPercentage()));
                return VoiceQueryResponse.builder()
                        .intent("TRAFFIC_STATUS")
                        .spokenResponse(spoken)
                        .actionDirective("FOCUS_ROAD_MG_ROAD")
                        .data(r)
                        .build();
            }

            List<RoadSegment> all = roadSegmentRepository.findAll();
            long severe = all.stream().filter(s -> "SEVERE".equals(s.getTrafficLevel().name())).count();
            String spoken = String.format("Overall city traffic is moderate with %d severe bottleneck corridor on MG Road.", severe);
            return VoiceQueryResponse.builder()
                    .intent("TRAFFIC_OVERVIEW")
                    .spokenResponse(spoken)
                    .actionDirective("SHOW_TRAFFIC_LAYER")
                    .data(all)
                    .build();
        }

        // 4. Emergency / Ambulance (e.g. "find nearby ambulance", "emergency help")
        if (q.contains("ambulance") || q.contains("emergency") || q.contains("hospital") || q.contains("doctor") || q.contains("bed")) {
            if (q.contains("bed") || q.contains("icu")) {
                List<Hospital> hospitals = hospitalRepository.findAll();
                Hospital h = hospitals.isEmpty() ? null : hospitals.get(0);
                String spoken = h != null ? String.format("%s has %d general beds and %d ICU beds available in emergency triage.",
                        h.getName(), h.getAvailableBeds(), h.getAvailableIcuBeds()) : "Hospitals are ready for emergency intake.";
                return VoiceQueryResponse.builder()
                        .intent("HOSPITAL_BEDS")
                        .spokenResponse(spoken)
                        .actionDirective("SHOW_HOSPITALS_LAYER")
                        .data(hospitals)
                        .build();
            }

            var nearby = ambulanceService.findNearby(lat, lon);
            String spoken = String.format("Found %d available emergency ambulances near your location. Nearest unit is %s, %s kilometers away with an estimated ETA of %d minutes.",
                    nearby.size(),
                    nearby.isEmpty() ? "AMB-101" : nearby.get(0).getAmbulanceNumber(),
                    nearby.isEmpty() ? "1.2" : nearby.get(0).getDistance().toString(),
                    nearby.isEmpty() ? 3 : nearby.get(0).getEta());

            return VoiceQueryResponse.builder()
                    .intent("NEARBY_AMBULANCE")
                    .spokenResponse(spoken)
                    .actionDirective("FOCUS_AMBULANCE_MARKERS")
                    .data(nearby)
                    .build();
        }

        // 5. Weather (e.g. "what is the weather", "is it raining")
        if (q.contains("weather") || q.contains("rain") || q.contains("temperature") || q.contains("forecast")) {
            WeatherDTO w = weatherService.getCurrentWeather();
            String spoken = String.format("Current weather in Guntur is %.1f degrees Celsius with %s. %s",
                    w.getTemperatureCelsius(),
                    w.getCondition().replace("_", " ").toLowerCase(),
                    w.getTrafficImpactAdvisory());
            return VoiceQueryResponse.builder()
                    .intent("WEATHER")
                    .spokenResponse(spoken)
                    .actionDirective("SHOW_WEATHER_CARD")
                    .data(w)
                    .build();
        }

        // Default General UrbanEye Query Response
        return VoiceQueryResponse.builder()
                .intent("GENERAL_ASSISTANT")
                .spokenResponse("UrbanEye AI is active. You can ask me to track buses, check traffic, find ambulances, view waterlogged areas, or check city weather.")
                .actionDirective("SHOW_OVERVIEW")
                .data(null)
                .build();
    }

    private String extractBusNumber(String q) {
        if (q.contains("21a") || q.contains("21 a") || q.contains("21")) return "21A";
        if (q.contains("14b") || q.contains("14 b") || q.contains("14")) return "14B";
        if (q.contains("7c")  || q.contains("7 c")  || q.contains("7"))  return "7C";
        if (q.contains("33d") || q.contains("33 d") || q.contains("33")) return "33D";
        return "21A"; // default
    }
}
