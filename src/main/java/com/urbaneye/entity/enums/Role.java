package com.urbaneye.entity.enums;

/**
 * Application roles for role-based access control.
 * CITIZEN / USER → Public-facing citizen portal (buses, ambulances, SOS, incidents)
 * POLICE         → City-wide tactical monitoring dashboard & green corridor control
 * HOSPITAL       → Emergency room triage, doctor management, bed & blood inventory
 */
public enum Role {
    USER,
    CITIZEN,
    POLICE,
    HOSPITAL;

    public boolean isCitizen() {
        return this == CITIZEN || this == USER;
    }

    public static Role fromString(String val) {
        if (val == null || val.isBlank()) return CITIZEN;
        String upper = val.trim().toUpperCase();
        if ("CITIZEN".equals(upper) || "USER".equals(upper)) return CITIZEN;
        if ("POLICE".equals(upper)) return POLICE;
        if ("HOSPITAL".equals(upper)) return HOSPITAL;
        return CITIZEN;
    }
}
