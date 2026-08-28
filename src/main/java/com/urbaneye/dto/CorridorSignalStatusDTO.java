package com.urbaneye.dto;

public class CorridorSignalStatusDTO {

    private String  signalCode;
    private String  zone;
    private Double  latitude;
    private Double  longitude;
    private String  currentState; // RED, GREEN, YELLOW, FORCED_GREEN
    private Long    distanceMeters;
    private Boolean isForcedGreen;
    private Boolean isUpcoming;
    private Boolean isPassed;

    public CorridorSignalStatusDTO() {}

    private CorridorSignalStatusDTO(Builder b) {
        this.signalCode     = b.signalCode;
        this.zone           = b.zone;
        this.latitude       = b.latitude;
        this.longitude      = b.longitude;
        this.currentState   = b.currentState;
        this.distanceMeters = b.distanceMeters;
        this.isForcedGreen  = b.isForcedGreen != null ? b.isForcedGreen : false;
        this.isUpcoming     = b.isUpcoming != null ? b.isUpcoming : false;
        this.isPassed       = b.isPassed != null ? b.isPassed : false;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  signalCode, zone, currentState;
        private Double  latitude, longitude;
        private Long    distanceMeters;
        private Boolean isForcedGreen, isUpcoming, isPassed;

        public Builder signalCode(String v)     { this.signalCode     = v; return this; }
        public Builder zone(String v)           { this.zone           = v; return this; }
        public Builder latitude(Double v)       { this.latitude       = v; return this; }
        public Builder longitude(Double v)      { this.longitude      = v; return this; }
        public Builder currentState(String v)   { this.currentState   = v; return this; }
        public Builder distanceMeters(Long v)   { this.distanceMeters = v; return this; }
        public Builder isForcedGreen(Boolean v) { this.isForcedGreen  = v; return this; }
        public Builder isUpcoming(Boolean v)    { this.isUpcoming     = v; return this; }
        public Builder isPassed(Boolean v)      { this.isPassed       = v; return this; }
        public CorridorSignalStatusDTO build()  { return new CorridorSignalStatusDTO(this); }
    }

    public String  getSignalCode()     { return signalCode; }
    public String  getZone()           { return zone; }
    public Double  getLatitude()       { return latitude; }
    public Double  getLongitude()      { return longitude; }
    public String  getCurrentState()   { return currentState; }
    public Long    getDistanceMeters() { return distanceMeters; }
    public Boolean getIsForcedGreen()  { return isForcedGreen; }
    public Boolean getIsUpcoming()     { return isUpcoming; }
    public Boolean getIsPassed()       { return isPassed; }
}
