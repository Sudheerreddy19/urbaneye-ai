package com.urbaneye.repository;

import com.urbaneye.entity.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusStopRepository extends JpaRepository<BusStop, Long> {
    List<BusStop> findByRouteIdOrderBySequenceNumberAsc(Long routeId);
}
