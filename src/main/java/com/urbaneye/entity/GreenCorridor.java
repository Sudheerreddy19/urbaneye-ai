package com.urbaneye.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents an active or completed Emergency Green Corridor for an ambulance.
 */
@Entity
@Table(name = "green_corridors")
public class GreenCorridor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "corridor_code", nullable = false, unique = true, length = 30)
    private String corridorCode; // e.g. "GC-01"

    @Column(nullable = false, length = 150)
    private String name; // e.g. "Guntur Emergency Trauma Corridor"

    @Column(name = "ambulance_number", nullable = false, length = 20)
    private String ambulanceNumber; // e.g. "AMB-101"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_hospital_id")
    private Hospital destinationHospital;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, CANCELLED

    @Column(name = "total_signals")
    private Integer totalSignals = 4;

    @Column(name = "signals_cleared")
    private Integer signalsCleared = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public GreenCorridor() {}

    private GreenCorridor(Builder b) {
        this.corridorCode        = b.corridorCode;
        this.name                = b.name;
        this.ambulanceNumber     = b.ambulanceNumber;
        this.destinationHospital = b.destinationHospital;
        this.status              = b.status != null ? b.status : "ACTIVE";
        this.totalSignals        = b.totalSignals != null ? b.totalSignals : 4;
        this.signalsCleared      = b.signalsCleared != null ? b.signalsCleared : 0;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String   corridorCode, name, ambulanceNumber, status;
        private Hospital destinationHospital;
        private Integer  totalSignals, signalsCleared;

        public Builder corridorCode(String v)        { this.corridorCode        = v; return this; }
        public Builder name(String v)                { this.name                = v; return this; }
        public Builder ambulanceNumber(String v)     { this.ambulanceNumber     = v; return this; }
        public Builder destinationHospital(Hospital v){ this.destinationHospital = v; return this; }
        public Builder status(String v)              { this.status              = v; return this; }
        public Builder totalSignals(Integer v)       { this.totalSignals        = v; return this; }
        public Builder signalsCleared(Integer v)     { this.signalsCleared      = v; return this; }
        public GreenCorridor build()                 { return new GreenCorridor(this); }
    }

    public Long getId() { return id; }
    public String getCorridorCode() { return corridorCode; }
    public void setCorridorCode(String v) { this.corridorCode = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getAmbulanceNumber() { return ambulanceNumber; }
    public void setAmbulanceNumber(String v) { this.ambulanceNumber = v; }
    public Hospital getDestinationHospital() { return destinationHospital; }
    public void setDestinationHospital(Hospital v) { this.destinationHospital = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public Integer getTotalSignals() { return totalSignals; }
    public void setTotalSignals(Integer v) { this.totalSignals = v; }
    public Integer getSignalsCleared() { return signalsCleared; }
    public void setSignalsCleared(Integer v) { this.signalsCleared = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime v) { this.completedAt = v; }
}
