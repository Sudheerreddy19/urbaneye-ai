package com.urbaneye.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(name = "license_number", nullable = false, unique = true, length = 20)
    private String licenseNumber;

    @Column(nullable = false)
    private Double rating = 5.0;

    @OneToOne(mappedBy = "driver")
    @JsonIgnore
    private Ambulance ambulance;

    public Driver() {}

    private Driver(Builder b) {
        this.name          = b.name;
        this.phone         = b.phone;
        this.licenseNumber = b.licenseNumber;
        this.rating        = b.rating != null ? b.rating : 5.0;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name, phone, licenseNumber;
        private Double rating;

        public Builder name(String v)          { this.name          = v; return this; }
        public Builder phone(String v)         { this.phone         = v; return this; }
        public Builder licenseNumber(String v) { this.licenseNumber = v; return this; }
        public Builder rating(Double v)        { this.rating        = v; return this; }
        public Driver build()                  { return new Driver(this); }
    }

    public Long      getId()                        { return id; }
    public String    getName()                      { return name; }
    public void      setName(String v)              { this.name = v; }
    public String    getPhone()                     { return phone; }
    public void      setPhone(String v)             { this.phone = v; }
    public String    getLicenseNumber()             { return licenseNumber; }
    public void      setLicenseNumber(String v)     { this.licenseNumber = v; }
    public Double    getRating()                    { return rating; }
    public void      setRating(Double v)            { this.rating = v; }
    public Ambulance getAmbulance()                 { return ambulance; }
    public void      setAmbulance(Ambulance v)      { this.ambulance = v; }
}
