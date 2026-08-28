package com.urbaneye.dto;

public class TravelOptionDTO {

    private String  mode;             // BUS, CAR, BIKE, METRO
    private Integer durationMinutes;  // e.g. 24
    private Integer fareInr;          // e.g. 20
    private Double  distanceKm;       // e.g. 15.2
    private String  trafficCondition; // LOW, MODERATE, HIGH, SEVERE
    private Boolean isRecommended;
    private String  badge;            // "FASTEST OPTION", "CHEAPEST OPTION", "ECO-FRIENDLY"

    public TravelOptionDTO() {}

    private TravelOptionDTO(Builder b) {
        this.mode             = b.mode;
        this.durationMinutes  = b.durationMinutes;
        this.fareInr          = b.fareInr;
        this.distanceKm       = b.distanceKm;
        this.trafficCondition = b.trafficCondition;
        this.isRecommended    = b.isRecommended != null ? b.isRecommended : false;
        this.badge            = b.badge;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  mode;
        private Integer durationMinutes;
        private Integer fareInr;
        private Double  distanceKm;
        private String  trafficCondition;
        private Boolean isRecommended;
        private String  badge;

        public Builder mode(String v)             { this.mode             = v; return this; }
        public Builder durationMinutes(Integer v) { this.durationMinutes  = v; return this; }
        public Builder fareInr(Integer v)         { this.fareInr          = v; return this; }
        public Builder distanceKm(Double v)       { this.distanceKm       = v; return this; }
        public Builder trafficCondition(String v) { this.trafficCondition = v; return this; }
        public Builder isRecommended(Boolean v)   { this.isRecommended    = v; return this; }
        public Builder badge(String v)            { this.badge            = v; return this; }
        public TravelOptionDTO build()            { return new TravelOptionDTO(this); }
    }

    public String  getMode()             { return mode; }
    public Integer getDurationMinutes()  { return durationMinutes; }
    public Integer getFareInr()          { return fareInr; }
    public Double  getDistanceKm()       { return distanceKm; }
    public String  getTrafficCondition() { return trafficCondition; }
    public Boolean getIsRecommended()    { return isRecommended; }
    public String  getBadge()            { return badge; }
}
