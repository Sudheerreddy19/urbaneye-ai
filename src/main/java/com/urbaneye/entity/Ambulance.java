package com.urbaneye.entity;

import com.urbaneye.entity.enums.AmbulanceStatus;
import com.urbaneye.entity.enums.AmbulanceType;
import jakarta.persistence.*;

@Entity
@Table(name = "ambulances")
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ambulance_number", nullable = false, unique = true, length = 20)
    private String ambulanceNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(name = "ambulance_type", nullable = false, length = 10)
    private AmbulanceType ambulanceType = AmbulanceType.BLS;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private AmbulanceStatus status = AmbulanceStatus.OFFLINE;

    private Double latitude;
    private Double longitude;
    private Double speed = 0.0;

    public Ambulance() {}

    private Ambulance(Builder b) {
        this.ambulanceNumber = b.ambulanceNumber;
        this.driver          = b.driver;
        this.hospital        = b.hospital;
        this.ambulanceType   = b.ambulanceType   != null ? b.ambulanceType   : AmbulanceType.BLS;
        this.status          = b.status          != null ? b.status          : AmbulanceStatus.OFFLINE;
        this.latitude        = b.latitude;
        this.longitude       = b.longitude;
        this.speed           = b.speed           != null ? b.speed           : 0.0;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String          ambulanceNumber;
        private Driver          driver;
        private Hospital        hospital;
        private AmbulanceType   ambulanceType;
        private AmbulanceStatus status;
        private Double          latitude, longitude, speed;

        public Builder ambulanceNumber(String v)          { this.ambulanceNumber = v; return this; }
        public Builder driver(Driver v)                   { this.driver          = v; return this; }
        public Builder hospital(Hospital v)               { this.hospital        = v; return this; }
        public Builder ambulanceType(AmbulanceType v)     { this.ambulanceType   = v; return this; }
        public Builder status(AmbulanceStatus v)          { this.status          = v; return this; }
        public Builder latitude(Double v)                 { this.latitude        = v; return this; }
        public Builder longitude(Double v)                { this.longitude       = v; return this; }
        public Builder speed(Double v)                    { this.speed           = v; return this; }
        public Ambulance build()                          { return new Ambulance(this); }
    }

    public Long            getId()                       { return id; }
    public String          getAmbulanceNumber()          { return ambulanceNumber; }
    public void            setAmbulanceNumber(String v)  { this.ambulanceNumber = v; }
    public Driver          getDriver()                   { return driver; }
    public void            setDriver(Driver v)           { this.driver = v; }
    public Hospital        getHospital()                 { return hospital; }
    public void            setHospital(Hospital v)       { this.hospital = v; }
    public AmbulanceType   getAmbulanceType()            { return ambulanceType; }
    public void            setAmbulanceType(AmbulanceType v) { this.ambulanceType = v; }
    public AmbulanceStatus getStatus()                   { return status; }
    public void            setStatus(AmbulanceStatus v)  { this.status = v; }
    public Double          getLatitude()                 { return latitude; }
    public void            setLatitude(Double v)         { this.latitude = v; }
    public Double          getLongitude()                { return longitude; }
    public void            setLongitude(Double v)        { this.longitude = v; }
    public Double          getSpeed()                    { return speed; }
    public void            setSpeed(Double v)            { this.speed = v; }
}
