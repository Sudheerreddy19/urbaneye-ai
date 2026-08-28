package com.urbaneye.dto;

public class IncomingEmergencyCaseDTO {

    private Long    requestId;
    private String  ambulanceNumber;
    private String  driverName;
    private String  driverPhone;
    private String  patientName;
    private String  severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String  status;
    private Integer etaMinutes;
    private Double  distanceKm;
    private Boolean greenCorridorActive;
    private String  currentSignalCode;
    private Double  pickupLatitude;
    private Double  pickupLongitude;

    public IncomingEmergencyCaseDTO() {}

    private IncomingEmergencyCaseDTO(Builder b) {
        this.requestId           = b.requestId;
        this.ambulanceNumber     = b.ambulanceNumber;
        this.driverName          = b.driverName;
        this.driverPhone         = b.driverPhone;
        this.patientName         = b.patientName;
        this.severity            = b.severity;
        this.status              = b.status;
        this.etaMinutes          = b.etaMinutes;
        this.distanceKm          = b.distanceKm;
        this.greenCorridorActive = b.greenCorridorActive != null ? b.greenCorridorActive : false;
        this.currentSignalCode   = b.currentSignalCode;
        this.pickupLatitude      = b.pickupLatitude;
        this.pickupLongitude     = b.pickupLongitude;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long    requestId;
        private String  ambulanceNumber, driverName, driverPhone, patientName, severity, status, currentSignalCode;
        private Integer etaMinutes;
        private Double  distanceKm, pickupLatitude, pickupLongitude;
        private Boolean greenCorridorActive;

        public Builder requestId(Long v)              { this.requestId           = v; return this; }
        public Builder ambulanceNumber(String v)      { this.ambulanceNumber     = v; return this; }
        public Builder driverName(String v)           { this.driverName          = v; return this; }
        public Builder driverPhone(String v)          { this.driverPhone         = v; return this; }
        public Builder patientName(String v)          { this.patientName         = v; return this; }
        public Builder severity(String v)             { this.severity            = v; return this; }
        public Builder status(String v)               { this.status              = v; return this; }
        public Builder etaMinutes(Integer v)          { this.etaMinutes          = v; return this; }
        public Builder distanceKm(Double v)           { this.distanceKm          = v; return this; }
        public Builder greenCorridorActive(Boolean v) { this.greenCorridorActive = v; return this; }
        public Builder currentSignalCode(String v)    { this.currentSignalCode   = v; return this; }
        public Builder pickupLatitude(Double v)       { this.pickupLatitude      = v; return this; }
        public Builder pickupLongitude(Double v)      { this.pickupLongitude     = v; return this; }
        public IncomingEmergencyCaseDTO build()       { return new IncomingEmergencyCaseDTO(this); }
    }

    public Long    getRequestId()           { return requestId; }
    public String  getAmbulanceNumber()     { return ambulanceNumber; }
    public String  getDriverName()          { return driverName; }
    public String  getDriverPhone()         { return driverPhone; }
    public String  getPatientName()         { return patientName; }
    public String  getSeverity()            { return severity; }
    public String  getStatus()              { return status; }
    public Integer getEtaMinutes()          { return etaMinutes; }
    public Double  getDistanceKm()          { return distanceKm; }
    public Boolean getGreenCorridorActive() { return greenCorridorActive; }
    public String  getCurrentSignalCode()   { return currentSignalCode; }
    public Double  getPickupLatitude()      { return pickupLatitude; }
    public Double  getPickupLongitude()     { return pickupLongitude; }
}
