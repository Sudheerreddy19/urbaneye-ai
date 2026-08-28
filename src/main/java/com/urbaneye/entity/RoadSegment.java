package com.urbaneye.entity;

import com.urbaneye.entity.enums.TrafficLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "road_segments")
public class RoadSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "road_name", nullable = false, length = 100)
    private String roadName; // e.g. "MG Road", "Ring Road", "NH-16"

    @Column(name = "start_lat", nullable = false)
    private Double startLat;

    @Column(name = "start_lon", nullable = false)
    private Double startLon;

    @Column(name = "end_lat", nullable = false)
    private Double endLat;

    @Column(name = "end_lon", nullable = false)
    private Double endLon;

    @Column(name = "avg_speed", nullable = false)
    private Double avgSpeed = 30.0; // km/h

    @Column(name = "vehicle_count", nullable = false)
    private Integer vehicleCount = 100;

    @Enumerated(EnumType.STRING)
    @Column(name = "traffic_level", nullable = false, length = 20)
    private TrafficLevel trafficLevel = TrafficLevel.LOW;

    @Column(name = "congestion_percentage", nullable = false)
    private Double congestionPercentage = 15.0; // 0 - 100%

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public RoadSegment() {}

    private RoadSegment(Builder b) {
        this.roadName             = b.roadName;
        this.startLat             = b.startLat;
        this.startLon             = b.startLon;
        this.endLat               = b.endLat;
        this.endLon               = b.endLon;
        this.avgSpeed             = b.avgSpeed != null ? b.avgSpeed : 30.0;
        this.vehicleCount         = b.vehicleCount != null ? b.vehicleCount : 100;
        this.trafficLevel         = b.trafficLevel != null ? b.trafficLevel : TrafficLevel.LOW;
        this.congestionPercentage = b.congestionPercentage != null ? b.congestionPercentage : 15.0;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String       roadName;
        private Double       startLat, startLon, endLat, endLon;
        private Double       avgSpeed;
        private Integer      vehicleCount;
        private TrafficLevel trafficLevel;
        private Double       congestionPercentage;

        public Builder roadName(String v)             { this.roadName             = v; return this; }
        public Builder startLat(Double v)             { this.startLat             = v; return this; }
        public Builder startLon(Double v)             { this.startLon             = v; return this; }
        public Builder endLat(Double v)               { this.endLat               = v; return this; }
        public Builder endLon(Double v)               { this.endLon               = v; return this; }
        public Builder avgSpeed(Double v)             { this.avgSpeed             = v; return this; }
        public Builder vehicleCount(Integer v)        { this.vehicleCount         = v; return this; }
        public Builder trafficLevel(TrafficLevel v)   { this.trafficLevel         = v; return this; }
        public Builder congestionPercentage(Double v) { this.congestionPercentage = v; return this; }
        public RoadSegment build()                    { return new RoadSegment(this); }
    }

    public Long getId() { return id; }
    public String getRoadName() { return roadName; }
    public void setRoadName(String v) { this.roadName = v; }
    public Double getStartLat() { return startLat; }
    public void setStartLat(Double v) { this.startLat = v; }
    public Double getStartLon() { return startLon; }
    public void setStartLon(Double v) { this.startLon = v; }
    public Double getEndLat() { return endLat; }
    public void setEndLat(Double v) { this.endLat = v; }
    public Double getEndLon() { return endLon; }
    public void setEndLon(Double v) { this.endLon = v; }
    public Double getAvgSpeed() { return avgSpeed; }
    public void setAvgSpeed(Double v) { this.avgSpeed = v; }
    public Integer getVehicleCount() { return vehicleCount; }
    public void setVehicleCount(Integer v) { this.vehicleCount = v; }
    public TrafficLevel getTrafficLevel() { return trafficLevel; }
    public void setTrafficLevel(TrafficLevel v) { this.trafficLevel = v; }
    public Double getCongestionPercentage() { return congestionPercentage; }
    public void setCongestionPercentage(Double v) { this.congestionPercentage = v; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
}
