package com.urbaneye.entity;

import com.urbaneye.entity.enums.IncidentSeverity;
import com.urbaneye.entity.enums.IncidentStatus;
import com.urbaneye.entity.enums.IncidentType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentType type;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private IncidentSeverity severity = IncidentSeverity.MEDIUM;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private IncidentStatus status = IncidentStatus.OPEN;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Incident() {}

    private Incident(Builder b) {
        this.type        = b.type;
        this.latitude    = b.latitude;
        this.longitude   = b.longitude;
        this.description = b.description;
        this.severity    = b.severity    != null ? b.severity : IncidentSeverity.MEDIUM;
        this.reportedBy  = b.reportedBy;
        this.status      = b.status      != null ? b.status   : IncidentStatus.OPEN;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private IncidentType     type;
        private Double           latitude, longitude;
        private String           description;
        private IncidentSeverity severity;
        private User             reportedBy;
        private IncidentStatus   status;

        public Builder type(IncidentType v)         { this.type        = v; return this; }
        public Builder latitude(Double v)           { this.latitude    = v; return this; }
        public Builder longitude(Double v)          { this.longitude   = v; return this; }
        public Builder description(String v)        { this.description = v; return this; }
        public Builder severity(IncidentSeverity v) { this.severity    = v; return this; }
        public Builder reportedBy(User v)           { this.reportedBy  = v; return this; }
        public Builder status(IncidentStatus v)     { this.status      = v; return this; }
        public Incident build()                     { return new Incident(this); }
    }

    public Long             getId()                      { return id; }
    public IncidentType     getType()                    { return type; }
    public void             setType(IncidentType v)      { this.type = v; }
    public Double           getLatitude()                { return latitude; }
    public void             setLatitude(Double v)        { this.latitude = v; }
    public Double           getLongitude()               { return longitude; }
    public void             setLongitude(Double v)       { this.longitude = v; }
    public String           getDescription()             { return description; }
    public void             setDescription(String v)     { this.description = v; }
    public IncidentSeverity getSeverity()                { return severity; }
    public void             setSeverity(IncidentSeverity v){ this.severity = v; }
    public User             getReportedBy()              { return reportedBy; }
    public void             setReportedBy(User v)        { this.reportedBy = v; }
    public IncidentStatus   getStatus()                  { return status; }
    public void             setStatus(IncidentStatus v)  { this.status = v; }
    public LocalDateTime    getCreatedAt()               { return createdAt; }
}
