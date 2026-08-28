package com.urbaneye.repository;

import com.urbaneye.entity.Ambulance;
import com.urbaneye.entity.enums.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {

    Optional<Ambulance> findByAmbulanceNumber(String ambulanceNumber);

    List<Ambulance> findByStatus(AmbulanceStatus status);

    /**
     * Finds all AVAILABLE ambulances within {@code radiusKm} kilometres using
     * the Haversine formula directly in PostgreSQL.
     *
     * LEAST(1.0, ...) guards against floating-point rounding that would push
     * the acos argument slightly above 1.0 and cause a domain error.
     */
    @Query(value = """
            SELECT * FROM ambulances a
            WHERE a.status = 'AVAILABLE'
              AND a.latitude  IS NOT NULL
              AND a.longitude IS NOT NULL
              AND (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(a.latitude))
                          * cos(radians(a.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(a.latitude))
                      )
                   )) <= :radiusKm
            ORDER BY (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(a.latitude))
                          * cos(radians(a.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(a.latitude))
                      )
                   ))
            """, nativeQuery = true)
    List<Ambulance> findNearbyAvailableAmbulances(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusKm") double radiusKm);

    List<Ambulance> findByHospitalId(Long hospitalId);
}
