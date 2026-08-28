package com.urbaneye.dto;

import com.urbaneye.entity.enums.TrafficLevel;

import java.time.LocalDateTime;

public class RoadSegmentDTO {

    private Long         id;
    private String       roadName;
    private Double       startLat;
    private Double       startLon;
    private Double       endLat;
    private Double       endLon;
    private Double       avgSpeed;
    private Integer      vehicleCount;
    private TrafficLevel trafficLevel;
    private Double       congestionPercentage;
    private LocalDateTime lastUpdated;

    public RoadSegmentDTO() {}

    private RoadSegmentDTO(Builder b) {
        this.id                   = b.id;
        this.roadName             = b.roadName;
        this.startLat             = b.startLat;
        this.startLon             = b.startLon;
        this.endLat               = b.endLat;
        this.endLon               = b.endLon;
        this.avgSpeed             = b.avgSpeed;
        this.vehicleCount         = b.vehicleCount;
        this.trafficLevel         = b.trafficLevel;
        this.congestionPercentage = b.congestionPercentage;
        this.lastUpdated          = b.lastUpdated;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long          id;
        private String        roadName;
        private Double        startLat, startLon, endLat, endLon;
        private Double        avgSpeed;
        private Integer       vehicleCount;
        private TrafficLevel  trafficLevel;
        private Double        congestionPercentage;
        private LocalDateTime lastUpdated;

        public Builder id(Long v)                         { this.id                   = v; return this; }
        public Builder roadName(String v)                 { this.roadName             = v; return this; }
        public Builder startLat(Double v)                 { this.startLat             = v; return this; }
        public Builder startLon(Double v)                 { this.startLon             = v; return this; }
        public Builder endLat(Double v)                   { this.endLat               = v; return this; }
        public Builder endLon(Double v)                   { this.endLon               = v; return this; }
        public Builder avgSpeed(Double v)                 { this.avgSpeed             = v; return this; }
        public Builder vehicleCount(Integer v)            { this.vehicleCount         = v; return this; }
        public Builder trafficLevel(TrafficLevel v)       { this.trafficLevel         = v; return this; }
        public Builder congestionPercentage(Double v)     { this.congestionPercentage = v; return this; }
        public Builder lastUpdated(LocalDateTime v)       { this.lastUpdated          = v; return this; }
        public RoadSegmentDTO build()                     { return new RoadSegmentDTO(this); }
    }

    public Long          getId()                   { return id; }
    public String        getRoadName()             { return roadName; }
    public Double        getStartLat()             { return startLat; }
    public Double        getStartLon()             { return startLon; }
    public Double        getEndLat()               { return endLat; }
    public Double        getEndLon()               { return endLon; }
    public Double        getAvgSpeed()             { return avgSpeed; }
    public Integer       getVehicleCount()         { return vehicleCount; }
    public TrafficLevel  getTrafficLevel()         { return trafficLevel; }
    public Double        getCongestionPercentage() { return congestionPercentage; }
    public LocalDateTime getLastUpdated()          { return lastUpdated; }
}
