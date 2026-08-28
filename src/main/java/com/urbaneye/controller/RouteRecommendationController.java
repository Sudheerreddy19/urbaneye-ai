package com.urbaneye.controller;

import com.urbaneye.dto.RouteRecommendationDTO;
import com.urbaneye.service.RouteRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Multi-Modal Route Comparison & Recommendation API
 *
 * GET /api/routes/recommend?fromLat=&fromLon=&toLat=&toLon=&fromName=&toName=
 */
@RestController
@RequestMapping("/api/routes")
public class RouteRecommendationController {

    private final RouteRecommendationService routeRecommendationService;

    public RouteRecommendationController(RouteRecommendationService routeRecommendationService) {
        this.routeRecommendationService = routeRecommendationService;
    }

    @GetMapping("/recommend")
    public ResponseEntity<RouteRecommendationDTO> getRecommendations(
            @RequestParam double fromLat,
            @RequestParam double fromLon,
            @RequestParam double toLat,
            @RequestParam double toLon,
            @RequestParam(required = false) String fromName,
            @RequestParam(required = false) String toName) {
        return ResponseEntity.ok(
                routeRecommendationService.getRecommendations(fromLat, fromLon, toLat, toLon, fromName, toName));
    }
}
