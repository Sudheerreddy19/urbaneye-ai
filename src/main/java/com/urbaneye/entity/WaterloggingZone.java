package com.urbaneye.entity;

import com.urbaneye.entity.enums.IncidentSeverity;
import jakarta.persistence.*;

/**
 * Represents a geographical waterlogged flood hazard zone.
 */
@Entity
@Table(name = "waterlogging_zones")
public class WaterloggingZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName; // e.g. "Lakshmipuram Railway Underpass"

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "radius_meters", nullable = false)
    private Double radiusMeters = 250.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentSeverity severity = IncidentSeverity.HIGH;

    @Column(name = "depth_cm")
    private Integer depthCm = 35; // Water depth in cm

    @Column(length = 300)
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    public WaterloggingZone() {}

    private WaterloggingZone(Builder b) {
        this.zoneName     = b.zoneName;
        this.latitude     = b.latitude;
        this.longitude    = b.longitude;
        this.radiusMeters = b.radiusMeters != null ? b.radiusMeters : 250.0;
        this.severity     = b.severity     != null ? b.severity     : IncidentSeverity.HIGH;
        this.depthCm      = b.depthCm      != null ? b.depthCm      : 35;
        this.description  = b.description;
        this.active       = b.active       != null ? b.active       : true;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String           zoneName, description;
        private Double           latitude, longitude, radiusMeters;
        private IncidentSeverity severity;
        private Integer          depthCm;
        private Boolean          active;

        public Builder zoneName(String v)         { this.zoneName     = v; return this; }
        public Builder latitude(Double v)         { this.latitude     = v; return this; }
        public Builder longitude(Double v)        { this.longitude    = v; return this; }
        public Builder radiusMeters(Double v)     { this.radiusMeters = v; return this; }
        public Builder severity(IncidentSeverity v){ this.severity     = v; return this; }
        public Builder depthCm(Integer v)         { this.depthCm      = v; return this; }
        public Builder description(String v)      { this.description  = v; return this; }
        public Builder active(Boolean v)          { this.active       = v; return this; }
        public WaterloggingZone build()           { return new WaterloggingZone(this); }
    }

    public Long getId() { return id; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String v) { this.zoneName = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public Double getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Double v) { this.radiusMeters = v; }
    public IncidentSeverity getSeverity() { return severity; }
    public void setSeverity(IncidentSeverity v) { this.severity = v; }
    public Integer getDepthCm() { return depthCm; }
    public void setDepthCm(Integer v) { this.depthCm = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean v) { this.active = v; }
}
