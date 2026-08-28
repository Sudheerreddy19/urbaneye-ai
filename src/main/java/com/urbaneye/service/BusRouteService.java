package com.urbaneye.service;

import com.urbaneye.entity.BusRoute;
import com.urbaneye.entity.BusStop;
import com.urbaneye.exception.ResourceNotFoundException;
import com.urbaneye.repository.BusRouteRepository;
import com.urbaneye.repository.BusStopRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusRouteService {

    private final BusRouteRepository busRouteRepository;
    private final BusStopRepository  busStopRepository;

    public BusRouteService(BusRouteRepository busRouteRepository,
                           BusStopRepository busStopRepository) {
        this.busRouteRepository = busRouteRepository;
        this.busStopRepository  = busStopRepository;
    }

    public List<BusRoute> getAllRoutes() {
        return busRouteRepository.findAll();
    }

    public BusRoute getByRouteNumber(String routeNumber) {
        return busRouteRepository.findByRouteNumber(routeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("BusRoute", "routeNumber", routeNumber));
    }

    public List<BusStop> getStopsByRoute(Long routeId) {
        return busStopRepository.findByRouteIdOrderBySequenceNumberAsc(routeId);
    }
}
