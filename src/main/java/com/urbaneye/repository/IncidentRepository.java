package com.urbaneye.repository;

import com.urbaneye.entity.Incident;
import com.urbaneye.entity.enums.IncidentStatus;
import com.urbaneye.entity.enums.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findByType(IncidentType type);

    List<Incident> findByReportedById(Long userId);

    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);

    List<Incident> findAllByOrderByCreatedAtDesc();
}
