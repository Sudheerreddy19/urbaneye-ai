package com.urbaneye.repository;

import com.urbaneye.entity.GreenCorridor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GreenCorridorRepository extends JpaRepository<GreenCorridor, Long> {
    Optional<GreenCorridor> findByAmbulanceNumberAndStatus(String ambulanceNumber, String status);
    List<GreenCorridor> findByStatus(String status);
    Optional<GreenCorridor> findByCorridorCode(String corridorCode);
}
