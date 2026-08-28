package com.urbaneye.dto.ai;

import java.util.List;

public class BusEtaPredictionDTO {

    private String  busNumber;
    private String  routeName;
    private Double  distanceKm;
    private Integer baseEtaMinutes;
    private Integer trafficDelayMinutes;
    private Integer weatherDelayMinutes;
    private Integer hazardDelayMinutes;
    private Integer predictedEtaMinutes;
    private String  occupancyLevel;
    private List<String> explainableFactors;

    public BusEtaPredictionDTO() {}

    private BusEtaPredictionDTO(Builder b) {
        this.busNumber             = b.busNumber;
        this.routeName             = b.routeName;
        this.distanceKm            = b.distanceKm;
        this.baseEtaMinutes        = b.baseEtaMinutes;
        this.trafficDelayMinutes   = b.trafficDelayMinutes;
        this.weatherDelayMinutes   = b.weatherDelayMinutes;
        this.hazardDelayMinutes    = b.hazardDelayMinutes;
        this.predictedEtaMinutes   = b.predictedEtaMinutes;
        this.occupancyLevel        = b.occupancyLevel;
        this.explainableFactors    = b.explainableFactors;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  busNumber, routeName, occupancyLevel;
        private Double  distanceKm;
        private Integer baseEtaMinutes, trafficDelayMinutes, weatherDelayMinutes, hazardDelayMinutes, predictedEtaMinutes;
        private List<String> explainableFactors;

        public Builder busNumber(String v)           { this.busNumber           = v; return this; }
        public Builder routeName(String v)           { this.routeName           = v; return this; }
        public Builder distanceKm(Double v)          { this.distanceKm          = v; return this; }
        public Builder baseEtaMinutes(Integer v)     { this.baseEtaMinutes      = v; return this; }
        public Builder trafficDelayMinutes(Integer v){ this.trafficDelayMinutes = v; return this; }
        public Builder weatherDelayMinutes(Integer v){ this.weatherDelayMinutes = v; return this; }
        public Builder hazardDelayMinutes(Integer v) { this.hazardDelayMinutes  = v; return this; }
        public Builder predictedEtaMinutes(Integer v){ this.predictedEtaMinutes = v; return this; }
        public Builder occupancyLevel(String v)      { this.occupancyLevel      = v; return this; }
        public Builder explainableFactors(List<String> v){ this.explainableFactors = v; return this; }
        public BusEtaPredictionDTO build()           { return new BusEtaPredictionDTO(this); }
    }

    public String  getBusNumber()           { return busNumber; }
    public String  getRouteName()           { return routeName; }
    public Double  getDistanceKm()          { return distanceKm; }
    public Integer getBaseEtaMinutes()      { return baseEtaMinutes; }
    public Integer getTrafficDelayMinutes() { return trafficDelayMinutes; }
    public Integer getWeatherDelayMinutes() { return weatherDelayMinutes; }
    public Integer getHazardDelayMinutes()  { return hazardDelayMinutes; }
    public Integer getPredictedEtaMinutes() { return predictedEtaMinutes; }
    public String  getOccupancyLevel()      { return occupancyLevel; }
    public List<String> getExplainableFactors() { return explainableFactors; }
}
