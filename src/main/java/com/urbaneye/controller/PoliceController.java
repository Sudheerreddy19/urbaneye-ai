package com.urbaneye.controller;

import com.urbaneye.dto.GreenCorridorStatusDTO;
import com.urbaneye.dto.RoadSegmentDTO;
import com.urbaneye.dto.WeatherDTO;
import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.Incident;
import com.urbaneye.entity.SignalEvent;
import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.WaterloggingZone;
import com.urbaneye.service.AmbulanceService;
import com.urbaneye.service.BusService;
import com.urbaneye.service.GreenCorridorService;
import com.urbaneye.service.IncidentService;
import com.urbaneye.service.TrafficService;
import com.urbaneye.service.WaterloggingService;
import com.urbaneye.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/police")
@PreAuthorize("hasRole('POLICE')")
public class PoliceController {

    private final AmbulanceService     ambulanceService;
    private final BusService           busService;
    private final IncidentService      incidentService;
    private final TrafficService       trafficService;
    private final GreenCorridorService corridorService;
    private final WeatherService       weatherService;
    private final WaterloggingService  waterloggingService;

    public PoliceController(AmbulanceService ambulanceService,
                            BusService busService,
                            IncidentService incidentService,
                            TrafficService trafficService,
                            GreenCorridorService corridorService,
                            WeatherService weatherService,
                            WaterloggingService waterloggingService) {
        this.ambulanceService    = ambulanceService;
        this.busService          = busService;
        this.incidentService     = incidentService;
        this.trafficService      = trafficService;
        this.corridorService     = corridorService;
        this.weatherService      = weatherService;
        this.waterloggingService = waterloggingService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        List<Ambulance>        ambulances = ambulanceService.getAll();
        List<Bus>              buses      = busService.getAll();
        List<Incident>         incidents  = incidentService.getOpen();
        List<TrafficSignal>    signals    = trafficService.getAllSignals();
        List<RoadSegmentDTO>   segments   = trafficService.getAllRoadSegments();
        Map<String, Object>    density    = trafficService.getDensitySummary();
        WeatherDTO             weather    = weatherService.getCurrentWeather();
        List<WaterloggingZone> zones      = waterloggingService.getActiveZones();

        long availableAmbs    = ambulances.stream().filter(a -> "AVAILABLE".equals(a.getStatus().name())).count();
        long emergencyAmbs    = ambulances.stream().filter(a -> "EMERGENCY".equals(a.getStatus().name())).count();
        long activeBuses      = buses.stream().filter(b -> "ACTIVE".equals(b.getStatus().name())).count();
        long forcedGreen      = corridorService.getActiveCorridors().size();
        long severeCongestion = segments.stream().filter(s -> "SEVERE".equals(s.getTrafficLevel().name())).count();

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("totalBuses",            buses.size());
        resp.put("activeBuses",           activeBuses);
        resp.put("totalAmbulances",       ambulances.size());
        resp.put("availableAmbulances",   availableAmbs);
        resp.put("emergencyAmbulances",   emergencyAmbs);
        resp.put("openHazards",           incidents.size());
        resp.put("severeCorridors",       severeCongestion);
        resp.put("totalSignals",          signals.size());
        resp.put("activeForcedGreen",     forcedGreen);
        resp.put("trafficDensity",        density);
        resp.put("waterloggingZonesCount",zones.size());
        resp.put("isRaining",             weather.getIsRaining());
        resp.put("weatherCondition",      weather.getCondition());
        resp.put("temperature",           weather.getTemperatureCelsius());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/ambulances")
    public ResponseEntity<List<Ambulance>> getAllAmbulances() {
        return ResponseEntity.ok(ambulanceService.getAll());
    }

    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busService.getAll());
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Incident>> getOpenIncidents() {
        return ResponseEntity.ok(incidentService.getOpen());
    }

    @GetMapping("/traffic-segments")
    public ResponseEntity<List<RoadSegmentDTO>> getRoadSegments() {
        return ResponseEntity.ok(trafficService.getAllRoadSegments());
    }

    @GetMapping("/signals")
    public ResponseEntity<List<TrafficSignal>> getAllSignals() {
        return ResponseEntity.ok(trafficService.getAllSignals());
    }

    @GetMapping("/corridors")
    public ResponseEntity<List<TrafficSignal>> getActiveCorridors() {
        return ResponseEntity.ok(corridorService.getActiveCorridors());
    }

    @GetMapping("/corridor/{ambulanceNumber}/status")
    public ResponseEntity<GreenCorridorStatusDTO> getCorridorStatus(@PathVariable String ambulanceNumber) {
        return ResponseEntity.ok(corridorService.getCorridorStatus(ambulanceNumber));
    }

    @GetMapping("/corridor/events")
    public ResponseEntity<List<SignalEvent>> getCorridorEvents() {
        return ResponseEntity.ok(corridorService.getRecentEvents());
    }

    @GetMapping("/waterlogging")
    public ResponseEntity<List<WaterloggingZone>> getWaterloggingZones() {
        return ResponseEntity.ok(waterloggingService.getActiveZones());
    }

    @GetMapping("/weather")
    public ResponseEntity<WeatherDTO> getWeather() {
        return ResponseEntity.ok(weatherService.getCurrentWeather());
    }
}
