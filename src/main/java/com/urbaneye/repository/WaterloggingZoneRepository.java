package com.urbaneye.repository;

import com.urbaneye.entity.WaterloggingZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterloggingZoneRepository extends JpaRepository<WaterloggingZone, Long> {
    List<WaterloggingZone> findByActiveTrue();
}
