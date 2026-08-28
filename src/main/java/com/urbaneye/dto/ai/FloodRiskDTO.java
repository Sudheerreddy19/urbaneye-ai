package com.urbaneye.dto.ai;

public class FloodRiskDTO {

    private String  zoneName;
    private Double  latitude;
    private Double  longitude;
    private String  riskLevel; // "LOW", "MODERATE", "HIGH", "CRITICAL"
    private Integer currentWaterDepthCm;
    private Integer predicted30MinDepthCm;
    private Boolean isSafeForEmergencyVehicles;
    private String  recommendedAlternateCorridor;

    public FloodRiskDTO() {}

    private FloodRiskDTO(Builder b) {
        this.zoneName                     = b.zoneName;
        this.latitude                     = b.latitude;
        this.longitude                    = b.longitude;
        this.riskLevel                    = b.riskLevel;
        this.currentWaterDepthCm          = b.currentWaterDepthCm;
        this.predicted30MinDepthCm        = b.predicted30MinDepthCm;
        this.isSafeForEmergencyVehicles   = b.isSafeForEmergencyVehicles != null ? b.isSafeForEmergencyVehicles : true;
        this.recommendedAlternateCorridor = b.recommendedAlternateCorridor;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  zoneName, riskLevel, recommendedAlternateCorridor;
        private Double  latitude, longitude;
        private Integer currentWaterDepthCm, predicted30MinDepthCm;
        private Boolean isSafeForEmergencyVehicles;

        public Builder zoneName(String v)                     { this.zoneName                     = v; return this; }
        public Builder latitude(Double v)                     { this.latitude                     = v; return this; }
        public Builder longitude(Double v)                    { this.longitude                    = v; return this; }
        public Builder riskLevel(String v)                    { this.riskLevel                    = v; return this; }
        public Builder currentWaterDepthCm(Integer v)         { this.currentWaterDepthCm          = v; return this; }
        public Builder predicted30MinDepthCm(Integer v)       { this.predicted30MinDepthCm        = v; return this; }
        public Builder isSafeForEmergencyVehicles(Boolean v)  { this.isSafeForEmergencyVehicles   = v; return this; }
        public Builder recommendedAlternateCorridor(String v) { this.recommendedAlternateCorridor = v; return this; }
        public FloodRiskDTO build()                           { return new FloodRiskDTO(this); }
    }

    public String  getZoneName()                     { return zoneName; }
    public Double  getLatitude()                     { return latitude; }
    public Double  getLongitude()                    { return longitude; }
    public String  getRiskLevel()                    { return riskLevel; }
    public Integer getCurrentWaterDepthCm()          { return currentWaterDepthCm; }
    public Integer getPredicted30MinDepthCm()        { return predicted30MinDepthCm; }
    public Boolean getIsSafeForEmergencyVehicles()   { return isSafeForEmergencyVehicles; }
    public String  getRecommendedAlternateCorridor() { return recommendedAlternateCorridor; }
}
