package com.urbaneye.dto.ai;

public class EmergencyConflictDTO {

    private String signalCode;
    private String higherPriorityVehicle; // e.g. "AMB-101 (CRITICAL)"
    private String lowerPriorityVehicle;  // e.g. "FIRE-201 (HIGH)"
    private String resolutionAction;      // "AMB-101 granted green priority; FIRE-201 queued for 15s delay."
    private Boolean conflictDetected;

    public EmergencyConflictDTO() {}

    public EmergencyConflictDTO(String signalCode, String higherPriorityVehicle, String lowerPriorityVehicle, String resolutionAction, Boolean conflictDetected) {
        this.signalCode             = signalCode;
        this.higherPriorityVehicle  = higherPriorityVehicle;
        this.lowerPriorityVehicle   = lowerPriorityVehicle;
        this.resolutionAction       = resolutionAction;
        this.conflictDetected       = conflictDetected != null ? conflictDetected : false;
    }

    public String  getSignalCode()            { return signalCode; }
    public String  getHigherPriorityVehicle() { return higherPriorityVehicle; }
    public String  getLowerPriorityVehicle()  { return lowerPriorityVehicle; }
    public String  getResolutionAction()      { return resolutionAction; }
    public Boolean getConflictDetected()      { return conflictDetected; }
}
