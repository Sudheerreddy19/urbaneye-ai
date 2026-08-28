package com.urbaneye.entity.enums;

/**
 * Lifecycle status of a reported road hazard/incident.
 *
 * REPORTED     — Newly submitted hazard
 * ACKNOWLEDGED — Police has seen and verified
 * IN_PROGRESS  — Dispatch or crew on site to fix
 * RESOLVED     — Hazard cleared / road open
 * OPEN         — Alias for REPORTED for backward compatibility
 */
public enum IncidentStatus {
    REPORTED,
    OPEN,
    ACKNOWLEDGED,
    IN_PROGRESS,
    RESOLVED
}
