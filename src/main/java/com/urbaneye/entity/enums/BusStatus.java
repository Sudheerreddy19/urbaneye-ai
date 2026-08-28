package com.urbaneye.entity.enums;

/**
 * Operational status of a public transit bus.
 *
 * ACTIVE      — In active transit on its route
 * INACTIVE    — Parked or off duty
 * MAINTENANCE — Under maintenance / garage
 * DELAYED     — On route but delayed due to traffic/breakdown
 * IDLE        — Temporary resting at depot/terminus
 */
public enum BusStatus {
    ACTIVE,
    INACTIVE,
    MAINTENANCE,
    DELAYED,
    IDLE
}
