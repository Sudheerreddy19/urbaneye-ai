package com.urbaneye.repository;

import com.urbaneye.entity.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    Optional<BusRoute> findByRouteNumber(String routeNumber);
}
