package com.urbaneye.dto.ai;

import com.urbaneye.entity.enums.TrafficLevel;

import java.util.List;

public class TrafficPredictionDTO {

    private String       roadName;
    private Double       currentSpeed;
    private TrafficLevel currentLevel;
    private TrafficLevel predicted15MinLevel;
    private TrafficLevel predicted30MinLevel;
    private Double       predicted15MinSpeed;
    private Double       predicted30MinSpeed;
    private Double       confidenceScore; // 0.0 - 1.0 (e.g. 0.92)
    private List<String> contributingFactors;

    public TrafficPredictionDTO() {}

    private TrafficPredictionDTO(Builder b) {
        this.roadName            = b.roadName;
        this.currentSpeed        = b.currentSpeed;
        this.currentLevel        = b.currentLevel;
        this.predicted15MinLevel = b.predicted15MinLevel;
        this.predicted30MinLevel = b.predicted30MinLevel;
        this.predicted15MinSpeed = b.predicted15MinSpeed;
        this.predicted30MinSpeed = b.predicted30MinSpeed;
        this.confidenceScore     = b.confidenceScore != null ? b.confidenceScore : 0.90;
        this.contributingFactors = b.contributingFactors;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String       roadName;
        private Double       currentSpeed, predicted15MinSpeed, predicted30MinSpeed, confidenceScore;
        private TrafficLevel currentLevel, predicted15MinLevel, predicted30MinLevel;
        private List<String> contributingFactors;

        public Builder roadName(String v)                     { this.roadName            = v; return this; }
        public Builder currentSpeed(Double v)                 { this.currentSpeed        = v; return this; }
        public Builder currentLevel(TrafficLevel v)           { this.currentLevel        = v; return this; }
        public Builder predicted15MinLevel(TrafficLevel v)    { this.predicted15MinLevel = v; return this; }
        public Builder predicted30MinLevel(TrafficLevel v)    { this.predicted30MinLevel = v; return this; }
        public Builder predicted15MinSpeed(Double v)          { this.predicted15MinSpeed = v; return this; }
        public Builder predicted30MinSpeed(Double v)          { this.predicted30MinSpeed = v; return this; }
        public Builder confidenceScore(Double v)              { this.confidenceScore     = v; return this; }
        public Builder contributingFactors(List<String> v)    { this.contributingFactors = v; return this; }
        public TrafficPredictionDTO build()                   { return new TrafficPredictionDTO(this); }
    }

    public String       getRoadName()            { return roadName; }
    public Double       getCurrentSpeed()        { return currentSpeed; }
    public TrafficLevel getCurrentLevel()        { return currentLevel; }
    public TrafficLevel getPredicted15MinLevel() { return predicted15MinLevel; }
    public TrafficLevel getPredicted30MinLevel() { return predicted30MinLevel; }
    public Double       getPredicted15MinSpeed() { return predicted15MinSpeed; }
    public Double       getPredicted30MinSpeed() { return predicted30MinSpeed; }
    public Double       getConfidenceScore()     { return confidenceScore; }
    public List<String> getContributingFactors() { return contributingFactors; }
}
