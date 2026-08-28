package com.urbaneye.repository;

import com.urbaneye.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    /**
     * Finds hospitals with at least one available bed, sorted by distance.
     */
    @Query(value = """
            SELECT * FROM hospitals h
            WHERE h.available_beds > 0
              AND h.latitude  IS NOT NULL
              AND h.longitude IS NOT NULL
              AND (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(h.latitude))
                          * cos(radians(h.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(h.latitude))
                      )
                   )) <= :radiusKm
            ORDER BY (6371 * acos(
                      LEAST(1.0,
                          cos(radians(:lat)) * cos(radians(h.latitude))
                          * cos(radians(h.longitude) - radians(:lon))
                          + sin(radians(:lat)) * sin(radians(h.latitude))
                      )
                   ))
            """, nativeQuery = true)
    List<Hospital> findNearbyHospitalsWithBeds(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusKm") double radiusKm);

    List<Hospital> findByEmergencyRoomAvailableTrue();
}
