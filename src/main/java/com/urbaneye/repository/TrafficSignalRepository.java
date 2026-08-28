package com.urbaneye.repository;

import com.urbaneye.entity.TrafficSignal;
import com.urbaneye.entity.enums.SignalState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrafficSignalRepository extends JpaRepository<TrafficSignal, Long> {

    Optional<TrafficSignal> findBySignalCode(String signalCode);

    List<TrafficSignal> findByCurrentState(SignalState state);

    List<TrafficSignal> findByZone(String zone);

    /** Signals that have expired FORCED_GREEN and need to revert */
    List<TrafficSignal> findByCurrentStateAndForcedGreenUntilBefore(
            SignalState state, LocalDateTime now);

    /**
     * All traffic signals within radiusKm of the given GPS position.
     * Used by GreenCorridorService to find signals to force green.
     */
    @Query(value = """
            SELECT * FROM traffic_signals ts
            WHERE ts.latitude  IS NOT NULL
              AND ts.longitude IS NOT NULL
              AND (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(ts.latitude))
                          * cos(radians(ts.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(ts.latitude))
                      )
                   )) <= :radiusKm
            ORDER BY (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(ts.latitude))
                          * cos(radians(ts.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(ts.latitude))
                      )
                   ))
            """, nativeQuery = true)
    List<TrafficSignal> findSignalsNearLocation(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusKm") double radiusKm);
}
