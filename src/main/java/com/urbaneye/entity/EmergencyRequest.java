package com.urbaneye.entity;

import com.urbaneye.entity.enums.EmergencyStatus;
import com.urbaneye.entity.enums.IncidentSeverity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a user's ambulance dispatch request.
 *
 * Full lifecycle:
 *   REQUESTED → ACCEPTED → EN_ROUTE → ARRIVED → PATIENT_PICKED → COMPLETED
 *                                                                      ↕
 *                                                                 CANCELLED
 */
@Entity
@Table(name = "emergency_requests")
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ambulance_id")
    private Ambulance ambulance;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "patient_name", length = 100)
    private String patientName;

    @Column(length = 500)
    private String description;

    // ── Pickup coordinates ────────────────────────────────────────────────────
    @Column(name = "pickup_latitude")
    private Double pickupLatitude;

    @Column(name = "pickup_longitude")
    private Double pickupLongitude;

    // ── Severity + Status ─────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private IncidentSeverity severity = IncidentSeverity.HIGH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmergencyStatus status = EmergencyStatus.REQUESTED;

    // ── Timestamps ────────────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "requested_at", updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public EmergencyRequest() {}

    private EmergencyRequest(Builder b) {
        this.user            = b.user;
        this.ambulance       = b.ambulance;
        this.hospital        = b.hospital;
        this.patientName     = b.patientName;
        this.description     = b.description;
        this.pickupLatitude  = b.pickupLatitude;
        this.pickupLongitude = b.pickupLongitude;
        this.severity        = b.severity    != null ? b.severity : IncidentSeverity.HIGH;
        this.status          = b.status      != null ? b.status   : EmergencyStatus.REQUESTED;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User             user;
        private Ambulance        ambulance;
        private Hospital         hospital;
        private String           patientName, description;
        private Double           pickupLatitude, pickupLongitude;
        private IncidentSeverity severity;
        private EmergencyStatus  status;

        public Builder user(User v)                   { this.user            = v; return this; }
        public Builder ambulance(Ambulance v)          { this.ambulance       = v; return this; }
        public Builder hospital(Hospital v)            { this.hospital        = v; return this; }
        public Builder patientName(String v)           { this.patientName     = v; return this; }
        public Builder description(String v)           { this.description     = v; return this; }
        public Builder pickupLatitude(Double v)        { this.pickupLatitude  = v; return this; }
        public Builder pickupLongitude(Double v)       { this.pickupLongitude = v; return this; }
        public Builder severity(IncidentSeverity v)    { this.severity        = v; return this; }
        public Builder status(EmergencyStatus v)       { this.status          = v; return this; }
        public EmergencyRequest build()                { return new EmergencyRequest(this); }
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────
    public Long             getId()                         { return id; }
    public User             getUser()                       { return user; }
    public void             setUser(User v)                 { this.user = v; }
    public Ambulance        getAmbulance()                  { return ambulance; }
    public void             setAmbulance(Ambulance v)       { this.ambulance = v; }
    public Hospital         getHospital()                   { return hospital; }
    public void             setHospital(Hospital v)         { this.hospital = v; }
    public String           getPatientName()                { return patientName; }
    public void             setPatientName(String v)        { this.patientName = v; }
    public String           getDescription()                { return description; }
    public void             setDescription(String v)        { this.description = v; }
    public Double           getPickupLatitude()             { return pickupLatitude; }
    public void             setPickupLatitude(Double v)     { this.pickupLatitude = v; }
    public Double           getPickupLongitude()            { return pickupLongitude; }
    public void             setPickupLongitude(Double v)    { this.pickupLongitude = v; }
    public IncidentSeverity getSeverity()                   { return severity; }
    public void             setSeverity(IncidentSeverity v) { this.severity = v; }
    public EmergencyStatus  getStatus()                     { return status; }
    public void             setStatus(EmergencyStatus v)    { this.status = v; }
    public LocalDateTime    getRequestedAt()                { return requestedAt; }
    public LocalDateTime    getAcceptedAt()                 { return acceptedAt; }
    public void             setAcceptedAt(LocalDateTime v)  { this.acceptedAt = v; }
    public LocalDateTime    getCompletedAt()                { return completedAt; }
    public void             setCompletedAt(LocalDateTime v) { this.completedAt = v; }
}
