package com.urbaneye.repository;

import com.urbaneye.entity.EmergencyRequest;
import com.urbaneye.entity.enums.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {

    /** All requests for a specific hospital in a given status */
    List<EmergencyRequest> findByHospitalIdAndStatus(Long hospitalId, EmergencyStatus status);

    /** All active requests for a user (not completed/cancelled) */
    List<EmergencyRequest> findByUserIdAndStatusNotIn(Long userId, List<EmergencyStatus> excludedStatuses);

    /** All requests assigned to an ambulance */
    List<EmergencyRequest> findByAmbulanceAmbulanceNumber(String ambulanceNumber);

    /** All active (in-flight) requests ordered by newest first */
    List<EmergencyRequest> findByStatusInOrderByRequestedAtDesc(List<EmergencyStatus> statuses);

    /** Latest active request for a given ambulance */
    EmergencyRequest findTopByAmbulanceAmbulanceNumberAndStatusNotInOrderByRequestedAtDesc(
            String ambulanceNumber, List<EmergencyStatus> excludedStatuses);
}
