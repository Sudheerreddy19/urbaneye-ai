package com.urbaneye.dto;

public class WeatherDTO {

    private Double  temperatureCelsius;
    private Integer humidityPercentage;
    private Double  rainfallMm;
    private String  condition; // "HEAVY_RAIN", "LIGHT_RAIN", "CLEAR", "CLOUDY", "THUNDERSTORM"
    private Double  windSpeedKmh;
    private Double  visibilityKm;
    private Boolean isRaining;
    private String  trafficImpactAdvisory;

    public WeatherDTO() {}

    private WeatherDTO(Builder b) {
        this.temperatureCelsius    = b.temperatureCelsius;
        this.humidityPercentage    = b.humidityPercentage;
        this.rainfallMm            = b.rainfallMm;
        this.condition             = b.condition;
        this.windSpeedKmh          = b.windSpeedKmh;
        this.visibilityKm          = b.visibilityKm;
        this.isRaining             = b.isRaining != null ? b.isRaining : false;
        this.trafficImpactAdvisory = b.trafficImpactAdvisory;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Double  temperatureCelsius, rainfallMm, windSpeedKmh, visibilityKm;
        private Integer humidityPercentage;
        private String  condition, trafficImpactAdvisory;
        private Boolean isRaining;

        public Builder temperatureCelsius(Double v)   { this.temperatureCelsius    = v; return this; }
        public Builder humidityPercentage(Integer v)   { this.humidityPercentage    = v; return this; }
        public Builder rainfallMm(Double v)           { this.rainfallMm            = v; return this; }
        public Builder condition(String v)            { this.condition             = v; return this; }
        public Builder windSpeedKmh(Double v)         { this.windSpeedKmh          = v; return this; }
        public Builder visibilityKm(Double v)         { this.visibilityKm          = v; return this; }
        public Builder isRaining(Boolean v)           { this.isRaining             = v; return this; }
        public Builder trafficImpactAdvisory(String v){ this.trafficImpactAdvisory = v; return this; }
        public WeatherDTO build()                     { return new WeatherDTO(this); }
    }

    public Double  getTemperatureCelsius()    { return temperatureCelsius; }
    public Integer getHumidityPercentage()    { return humidityPercentage; }
    public Double  getRainfallMm()            { return rainfallMm; }
    public String  getCondition()             { return condition; }
    public Double  getWindSpeedKmh()          { return windSpeedKmh; }
    public Double  getVisibilityKm()          { return visibilityKm; }
    public Boolean getIsRaining()             { return isRaining; }
    public String  getTrafficImpactAdvisory() { return trafficImpactAdvisory; }
}
