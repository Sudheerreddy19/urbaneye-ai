package com.urbaneye.repository;

import com.urbaneye.entity.RoadSegment;
import com.urbaneye.entity.enums.TrafficLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadSegmentRepository extends JpaRepository<RoadSegment, Long> {
    Optional<RoadSegment> findByRoadName(String roadName);
    List<RoadSegment> findByTrafficLevel(TrafficLevel trafficLevel);
}
