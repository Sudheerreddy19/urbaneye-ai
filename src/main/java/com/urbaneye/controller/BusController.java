package com.urbaneye.controller;

import com.urbaneye.dto.BusDetailsDTO;
import com.urbaneye.dto.BusLocationDTO;
import com.urbaneye.dto.OccupancyDTO;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.BusRoute;
import com.urbaneye.service.BusRouteService;
import com.urbaneye.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public Transit & Bus Management REST API
 *
 * GET  /api/buses                                        — all buses
 * GET  /api/buses/{number}                              — raw bus object
 * GET  /api/buses/{number}/details?latitude=&longitude=  — user click-card with next stop & occupancy
 * GET  /api/buses/{number}/occupancy                    — live occupancy percentage & crowdedness
 * GET  /api/buses/nearby?latitude=&longitude=           — nearby active buses
 * GET  /api/buses/routes                                 — all registered routes and stop lists
 * GET  /api/buses/route/{routeNumber}                   — all buses running on a given route
 * POST /api/buses/location                              — driver/GPS location update
 */
@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService      busService;
    private final BusRouteService busRouteService;

    public BusController(BusService busService, BusRouteService busRouteService) {
        this.busService      = busService;
        this.busRouteService = busRouteService;
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getAll() {
        return ResponseEntity.ok(busService.getAll());
    }

    @GetMapping("/{number}")
    public ResponseEntity<Bus> getByNumber(@PathVariable String number) {
        return ResponseEntity.ok(busService.getByBusNumber(number));
    }

    @GetMapping("/{number}/details")
    public ResponseEntity<BusDetailsDTO> getDetails(
            @PathVariable String number,
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(busService.getDetails(number, latitude, longitude));
    }

    @GetMapping("/{number}/occupancy")
    public ResponseEntity<OccupancyDTO> getOccupancy(@PathVariable String number) {
        return ResponseEntity.ok(busService.getOccupancy(number));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Bus>> getNearby(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(busService.findNearby(latitude, longitude));
    }

    @GetMapping("/routes")
    public ResponseEntity<List<BusRoute>> getAllRoutes() {
        return ResponseEntity.ok(busRouteService.getAllRoutes());
    }

    @GetMapping("/route/{routeNumber}")
    public ResponseEntity<List<Bus>> getBusesByRoute(@PathVariable String routeNumber) {
        return ResponseEntity.ok(busService.getBusesByRoute(routeNumber));
    }

    @PostMapping("/location")
    public ResponseEntity<Void> updateLocation(@Valid @RequestBody BusLocationDTO dto) {
        busService.updateLocation(dto);
        return ResponseEntity.ok().build();
    }
}
