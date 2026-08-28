package com.urbaneye.repository;

import com.urbaneye.entity.Bus;
import com.urbaneye.entity.enums.BusStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    Optional<Bus> findByBusNumber(String busNumber);

    List<Bus> findByStatus(BusStatus status);

    List<Bus> findByBusRouteRouteNumber(String routeNumber);

    /**
     * Finds ACTIVE buses within {@code radiusKm} km using the Haversine formula.
     */
    @Query(value = """
            SELECT * FROM buses b
            WHERE b.status = 'ACTIVE'
              AND b.latitude  IS NOT NULL
              AND b.longitude IS NOT NULL
              AND (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(b.latitude))
                          * cos(radians(b.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(b.latitude))
                      )
                   )) <= :radiusKm
            ORDER BY (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(b.latitude))
                          * cos(radians(b.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(b.latitude))
                      )
                   ))
            """, nativeQuery = true)
    List<Bus> findNearbyActiveBuses(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusKm") double radiusKm);
}
