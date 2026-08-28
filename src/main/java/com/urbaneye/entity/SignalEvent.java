package com.urbaneye.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Event log for signal preemption (e.g. FORCED_GREEN activated or RELEASED).
 */
@Entity
@Table(name = "signal_events")
public class SignalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "signal_code", nullable = false, length = 20)
    private String signalCode; // e.g. "SIGNAL-01"

    @Column(name = "ambulance_number", nullable = false, length = 20)
    private String ambulanceNumber; // e.g. "AMB-101"

    @Column(name = "event_type", nullable = false, length = 30)
    private String eventType; // "PREEMPTION_TRIGGERED", "SIGNAL_RELEASED", "TIMEOUT_EXPIRED"

    @Column(name = "previous_state", length = 20)
    private String previousState;

    @Column(name = "new_state", length = 20)
    private String newState;

    @Column(name = "distance_meters")
    private Long distanceMeters;

    @Column(length = 250)
    private String message;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public SignalEvent() {}

    private SignalEvent(Builder b) {
        this.signalCode      = b.signalCode;
        this.ambulanceNumber = b.ambulanceNumber;
        this.eventType       = b.eventType;
        this.previousState   = b.previousState;
        this.newState        = b.newState;
        this.distanceMeters  = b.distanceMeters;
        this.message         = b.message;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String signalCode, ambulanceNumber, eventType, previousState, newState, message;
        private Long distanceMeters;

        public Builder signalCode(String v)      { this.signalCode      = v; return this; }
        public Builder ambulanceNumber(String v) { this.ambulanceNumber = v; return this; }
        public Builder eventType(String v)       { this.eventType       = v; return this; }
        public Builder previousState(String v)   { this.previousState   = v; return this; }
        public Builder newState(String v)        { this.newState        = v; return this; }
        public Builder distanceMeters(Long v)    { this.distanceMeters  = v; return this; }
        public Builder message(String v)         { this.message         = v; return this; }
        public SignalEvent build()               { return new SignalEvent(this); }
    }

    public Long getId() { return id; }
    public String getSignalCode() { return signalCode; }
    public void setSignalCode(String v) { this.signalCode = v; }
    public String getAmbulanceNumber() { return ambulanceNumber; }
    public void setAmbulanceNumber(String v) { this.ambulanceNumber = v; }
    public String getEventType() { return eventType; }
    public void setEventType(String v) { this.eventType = v; }
    public String getPreviousState() { return previousState; }
    public void setPreviousState(String v) { this.previousState = v; }
    public String getNewState() { return newState; }
    public void setNewState(String v) { this.newState = v; }
    public Long getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Long v) { this.distanceMeters = v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { this.message = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
