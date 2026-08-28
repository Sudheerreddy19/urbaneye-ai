package com.urbaneye.repository;

import com.urbaneye.entity.SignalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignalEventRepository extends JpaRepository<SignalEvent, Long> {
    List<SignalEvent> findByAmbulanceNumberOrderByCreatedAtDesc(String ambulanceNumber);
    List<SignalEvent> findTop20ByOrderByCreatedAtDesc();
}
