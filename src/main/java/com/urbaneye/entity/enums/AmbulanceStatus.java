package com.urbaneye.entity.enums;

/**
 * Operational status of an ambulance unit.
 */
public enum AmbulanceStatus {
    AVAILABLE,   // Ready to accept emergency calls
    BUSY,        // Currently on a non-emergency trip
    EMERGENCY,   // Active emergency response — triggers green corridor
    OFFLINE      // Out of service / end of shift
}
