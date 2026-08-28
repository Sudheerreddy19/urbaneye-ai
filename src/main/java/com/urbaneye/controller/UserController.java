package com.urbaneye.controller;

import com.urbaneye.dto.NearbyAmbulanceDTO;
import com.urbaneye.entity.Bus;
import com.urbaneye.entity.User;
import com.urbaneye.service.AmbulanceService;
import com.urbaneye.service.BusService;
import com.urbaneye.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService      userService;
    private final AmbulanceService ambulanceService;
    private final BusService       busService;

    public UserController(UserService userService,
                          AmbulanceService ambulanceService,
                          BusService busService) {
        this.userService      = userService;
        this.ambulanceService = ambulanceService;
        this.busService       = busService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getByEmail(auth.getName()));
    }

    @GetMapping("/nearby-ambulances")
    public ResponseEntity<List<NearbyAmbulanceDTO>> getNearbyAmbulances(
            @RequestParam double latitude, @RequestParam double longitude) {
        return ResponseEntity.ok(ambulanceService.findNearby(latitude, longitude));
    }

    @GetMapping("/nearby-buses")
    public ResponseEntity<List<Bus>> getNearbyBuses(
            @RequestParam double latitude, @RequestParam double longitude) {
        return ResponseEntity.ok(busService.findNearby(latitude, longitude));
    }
}
