package com.urbaneye.entity;

import com.urbaneye.entity.enums.SignalState;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_signals")
public class TrafficSignal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "signal_code", nullable = false, unique = true, length = 20)
    private String signalCode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_state", nullable = false, length = 15)
    private SignalState currentState = SignalState.RED;

    @Column(length = 50)
    private String zone;

    @Column(name = "forced_green_until")
    private LocalDateTime forcedGreenUntil;

    @Column(name = "forced_by_ambulance", length = 20)
    private String forcedByAmbulance;

    public TrafficSignal() {}

    private TrafficSignal(Builder b) {
        this.signalCode        = b.signalCode;
        this.latitude          = b.latitude;
        this.longitude         = b.longitude;
        this.currentState      = b.currentState != null ? b.currentState : SignalState.RED;
        this.zone              = b.zone;
        this.forcedGreenUntil  = b.forcedGreenUntil;
        this.forcedByAmbulance = b.forcedByAmbulance;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String      signalCode, zone, forcedByAmbulance;
        private Double      latitude, longitude;
        private SignalState currentState;
        private LocalDateTime forcedGreenUntil;

        public Builder signalCode(String v)           { this.signalCode        = v; return this; }
        public Builder latitude(Double v)             { this.latitude          = v; return this; }
        public Builder longitude(Double v)            { this.longitude         = v; return this; }
        public Builder currentState(SignalState v)    { this.currentState      = v; return this; }
        public Builder zone(String v)                 { this.zone              = v; return this; }
        public Builder forcedGreenUntil(LocalDateTime v){ this.forcedGreenUntil  = v; return this; }
        public Builder forcedByAmbulance(String v)   { this.forcedByAmbulance = v; return this; }
        public TrafficSignal build()                  { return new TrafficSignal(this); }
    }

    public Long          getId()                        { return id; }
    public String        getSignalCode()                { return signalCode; }
    public void          setSignalCode(String v)        { this.signalCode = v; }
    public Double        getLatitude()                  { return latitude; }
    public void          setLatitude(Double v)          { this.latitude = v; }
    public Double        getLongitude()                 { return longitude; }
    public void          setLongitude(Double v)         { this.longitude = v; }
    public SignalState   getCurrentState()              { return currentState; }
    public void          setCurrentState(SignalState v) { this.currentState = v; }
    public String        getZone()                      { return zone; }
    public void          setZone(String v)              { this.zone = v; }
    public LocalDateTime getForcedGreenUntil()          { return forcedGreenUntil; }
    public void          setForcedGreenUntil(LocalDateTime v){ this.forcedGreenUntil = v; }
    public String        getForcedByAmbulance()         { return forcedByAmbulance; }
    public void          setForcedByAmbulance(String v) { this.forcedByAmbulance = v; }
}
