package com.urbaneye.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class UrbanInsightsDTO {

    private List<String> trafficAlerts          = new ArrayList<>();
    private List<String> floodRiskAlerts        = new ArrayList<>();
    private List<String> hospitalLoadAlerts     = new ArrayList<>();
    private List<String> emergencyCorridorAlerts = new ArrayList<>();
    private Double       aiConfidenceScore;

    public UrbanInsightsDTO() {}

    private UrbanInsightsDTO(Builder b) {
        this.trafficAlerts           = b.trafficAlerts;
        this.floodRiskAlerts         = b.floodRiskAlerts;
        this.hospitalLoadAlerts      = b.hospitalLoadAlerts;
        this.emergencyCorridorAlerts = b.emergencyCorridorAlerts;
        this.aiConfidenceScore       = b.aiConfidenceScore != null ? b.aiConfidenceScore : 0.94;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private List<String> trafficAlerts          = new ArrayList<>();
        private List<String> floodRiskAlerts        = new ArrayList<>();
        private List<String> hospitalLoadAlerts     = new ArrayList<>();
        private List<String> emergencyCorridorAlerts = new ArrayList<>();
        private Double       aiConfidenceScore;

        public Builder trafficAlerts(List<String> v)          { this.trafficAlerts           = v; return this; }
        public Builder floodRiskAlerts(List<String> v)        { this.floodRiskAlerts         = v; return this; }
        public Builder hospitalLoadAlerts(List<String> v)     { this.hospitalLoadAlerts      = v; return this; }
        public Builder emergencyCorridorAlerts(List<String> v){ this.emergencyCorridorAlerts = v; return this; }
        public Builder aiConfidenceScore(Double v)            { this.aiConfidenceScore       = v; return this; }
        public UrbanInsightsDTO build()                       { return new UrbanInsightsDTO(this); }
    }

    public List<String> getTrafficAlerts()           { return trafficAlerts; }
    public List<String> getFloodRiskAlerts()         { return floodRiskAlerts; }
    public List<String> getHospitalLoadAlerts()      { return hospitalLoadAlerts; }
    public List<String> getEmergencyCorridorAlerts() { return emergencyCorridorAlerts; }
    public Double       getAiConfidenceScore()       { return aiConfidenceScore; }
}
