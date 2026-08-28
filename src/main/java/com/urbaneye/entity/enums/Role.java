package com.urbaneye.entity.enums;

/**
 * Application roles for role-based access control.
 * USER   → Public-facing dashboard (buses, ambulances, incidents)
 * POLICE → City-wide monitoring dashboard
 * HOSPITAL → Hospital management dashboard
 */
public enum Role {
    USER,
    POLICE,
    HOSPITAL
}
