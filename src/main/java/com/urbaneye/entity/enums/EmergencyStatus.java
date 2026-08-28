package com.urbaneye.entity.enums;

/**
 * Full lifecycle states for an emergency case / hospital queue.
 */
public enum EmergencyStatus {
    REQUESTED,
    AMBULANCE_ASSIGNED,
    ACCEPTED,
    PICKUP_IN_PROGRESS,
    EN_ROUTE,
    PATIENT_ONBOARD,
    PATIENT_PICKED,
    HOSPITAL_IN_TRANSIT,
    ARRIVED,
    COMPLETED,
    CANCELLED
}
