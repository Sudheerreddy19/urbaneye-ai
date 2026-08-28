package com.urbaneye.repository;

import com.urbaneye.entity.HospitalBed;
import com.urbaneye.entity.enums.BedStatus;
import com.urbaneye.entity.enums.BedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalBedRepository extends JpaRepository<HospitalBed, Long> {

    List<HospitalBed> findByHospitalId(Long hospitalId);

    List<HospitalBed> findByHospitalIdAndStatus(Long hospitalId, BedStatus status);

    List<HospitalBed> findByHospitalIdAndBedType(Long hospitalId, BedType bedType);

    long countByHospitalIdAndStatus(Long hospitalId, BedStatus status);

    long countByHospitalIdAndBedTypeAndStatus(Long hospitalId, BedType bedType, BedStatus status);
}
