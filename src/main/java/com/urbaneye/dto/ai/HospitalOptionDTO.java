package com.urbaneye.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class HospitalOptionDTO {

    private Long    hospitalId;
    private String  hospitalName;
    private Integer etaMinutes;
    private Double  distanceKm;
    private Integer availableIcuBeds;
    private Integer availableGeneralBeds;
    private Integer bloodUnits;
    private String  trafficCondition;
    private Boolean hasWaterloggingOnRoute;
    private Boolean isRecommended;
    private Double  matchScore; // 0.0 - 100.0
    private List<String> reasons = new ArrayList<>();

    public HospitalOptionDTO() {}

    private HospitalOptionDTO(Builder b) {
        this.hospitalId              = b.hospitalId;
        this.hospitalName            = b.hospitalName;
        this.etaMinutes              = b.etaMinutes;
        this.distanceKm              = b.distanceKm;
        this.availableIcuBeds        = b.availableIcuBeds;
        this.availableGeneralBeds    = b.availableGeneralBeds;
        this.bloodUnits              = b.bloodUnits;
        this.trafficCondition        = b.trafficCondition;
        this.hasWaterloggingOnRoute  = b.hasWaterloggingOnRoute != null ? b.hasWaterloggingOnRoute : false;
        this.isRecommended          = b.isRecommended != null ? b.isRecommended : false;
        this.matchScore              = b.matchScore != null ? b.matchScore : 85.0;
        if (b.reasons != null) {
            this.reasons = b.reasons;
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long    hospitalId;
        private String  hospitalName, trafficCondition;
        private Integer etaMinutes, availableIcuBeds, availableGeneralBeds, bloodUnits;
        private Double  distanceKm, matchScore;
        private Boolean hasWaterloggingOnRoute, isRecommended;
        private List<String> reasons = new ArrayList<>();

        public Builder hospitalId(Long v)              { this.hospitalId              = v; return this; }
        public Builder hospitalName(String v)          { this.hospitalName            = v; return this; }
        public Builder etaMinutes(Integer v)           { this.etaMinutes              = v; return this; }
        public Builder distanceKm(Double v)            { this.distanceKm              = v; return this; }
        public Builder availableIcuBeds(Integer v)     { this.availableIcuBeds        = v; return this; }
        public Builder availableGeneralBeds(Integer v) { this.availableGeneralBeds    = v; return this; }
        public Builder bloodUnits(Integer v)           { this.bloodUnits              = v; return this; }
        public Builder trafficCondition(String v)      { this.trafficCondition        = v; return this; }
        public Builder hasWaterloggingOnRoute(Boolean v){ this.hasWaterloggingOnRoute = v; return this; }
        public Builder isRecommended(Boolean v)        { this.isRecommended          = v; return this; }
        public Builder matchScore(Double v)            { this.matchScore              = v; return this; }
        public Builder reasons(List<String> v)         { this.reasons                 = v; return this; }
        public HospitalOptionDTO build()               { return new HospitalOptionDTO(this); }
    }

    public Long    getHospitalId()             { return hospitalId; }
    public String  getHospitalName()           { return hospitalName; }
    public Integer getEtaMinutes()             { return etaMinutes; }
    public Double  getDistanceKm()             { return distanceKm; }
    public Integer getAvailableIcuBeds()       { return availableIcuBeds; }
    public Integer getAvailableGeneralBeds()   { return availableGeneralBeds; }
    public Integer getBloodUnits()             { return bloodUnits; }
    public String  getTrafficCondition()       { return trafficCondition; }
    public Boolean getHasWaterloggingOnRoute() { return hasWaterloggingOnRoute; }
    public Boolean getIsRecommended()          { return isRecommended; }
    public Double  getMatchScore()             { return matchScore; }
    public List<String> getReasons()           { return reasons; }
}
