package com.urbaneye.entity.enums;

/**
 * Traffic signal light states.
 * FORCED_GREEN is set by the green corridor algorithm when an
 * emergency ambulance is within 300m of the signal.
 */
public enum SignalState {
    RED,
    YELLOW,
    GREEN,
    FORCED_GREEN  // Overridden by ambulance emergency corridor
}
