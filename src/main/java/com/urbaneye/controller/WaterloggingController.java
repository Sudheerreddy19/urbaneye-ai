package com.urbaneye.controller;

import com.urbaneye.entity.WaterloggingZone;
import com.urbaneye.service.WaterloggingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/waterlogging")
public class WaterloggingController {

    private final WaterloggingService waterloggingService;

    public WaterloggingController(WaterloggingService waterloggingService) {
        this.waterloggingService = waterloggingService;
    }

    @GetMapping("/zones")
    public ResponseEntity<List<WaterloggingZone>> getZones() {
        return ResponseEntity.ok(waterloggingService.getActiveZones());
    }
}
