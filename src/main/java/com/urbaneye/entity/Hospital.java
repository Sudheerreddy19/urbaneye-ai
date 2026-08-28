package com.urbaneye.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 250)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 15)
    private String phone;

    @Column(name = "total_beds")
    private Integer totalBeds = 0;

    @Column(name = "available_beds")
    private Integer availableBeds = 0;

    @Column(name = "icu_beds")
    private Integer icuBeds = 0;

    @Column(name = "available_icu_beds")
    private Integer availableIcuBeds = 0;

    @Column(name = "blood_units")
    private Integer bloodUnits = 24;

    @Column(name = "emergency_doctors")
    private Integer emergencyDoctors = 4;

    @Column(name = "emergency_room_available")
    private Boolean emergencyRoomAvailable = true;

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HospitalBed> beds;

    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Ambulance> ambulances;

    public Hospital() {}

    private Hospital(Builder b) {
        this.name                   = b.name;
        this.address                = b.address;
        this.latitude               = b.latitude;
        this.longitude              = b.longitude;
        this.phone                  = b.phone;
        this.totalBeds              = b.totalBeds != null ? b.totalBeds : 0;
        this.availableBeds          = b.availableBeds != null ? b.availableBeds : 0;
        this.icuBeds                = b.icuBeds != null ? b.icuBeds : 0;
        this.availableIcuBeds       = b.availableIcuBeds != null ? b.availableIcuBeds : 0;
        this.bloodUnits             = b.bloodUnits != null ? b.bloodUnits : 24;
        this.emergencyDoctors       = b.emergencyDoctors != null ? b.emergencyDoctors : 4;
        this.emergencyRoomAvailable = b.emergencyRoomAvailable != null ? b.emergencyRoomAvailable : true;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name, address, phone;
        private Double latitude, longitude;
        private Integer totalBeds, availableBeds, icuBeds, availableIcuBeds, bloodUnits, emergencyDoctors;
        private Boolean emergencyRoomAvailable;

        public Builder name(String v)                      { this.name                   = v; return this; }
        public Builder address(String v)                   { this.address                = v; return this; }
        public Builder phone(String v)                     { this.phone                  = v; return this; }
        public Builder latitude(Double v)                  { this.latitude               = v; return this; }
        public Builder longitude(Double v)                 { this.longitude              = v; return this; }
        public Builder totalBeds(Integer v)                { this.totalBeds              = v; return this; }
        public Builder availableBeds(Integer v)            { this.availableBeds          = v; return this; }
        public Builder icuBeds(Integer v)                  { this.icuBeds                = v; return this; }
        public Builder availableIcuBeds(Integer v)         { this.availableIcuBeds       = v; return this; }
        public Builder bloodUnits(Integer v)               { this.bloodUnits             = v; return this; }
        public Builder emergencyDoctors(Integer v)         { this.emergencyDoctors       = v; return this; }
        public Builder emergencyRoomAvailable(Boolean v)   { this.emergencyRoomAvailable = v; return this; }
        public Hospital build()                            { return new Hospital(this); }
    }

    public Long    getId()                                     { return id; }
    public String  getName()                                   { return name; }
    public void    setName(String v)                           { this.name = v; }
    public String  getAddress()                                { return address; }
    public void    setAddress(String v)                        { this.address = v; }
    public Double  getLatitude()                               { return latitude; }
    public void    setLatitude(Double v)                       { this.latitude = v; }
    public Double  getLongitude()                              { return longitude; }
    public void    setLongitude(Double v)                      { this.longitude = v; }
    public String  getPhone()                                  { return phone; }
    public void    setPhone(String v)                          { this.phone = v; }
    public Integer getTotalBeds()                              { return totalBeds; }
    public void    setTotalBeds(Integer v)                     { this.totalBeds = v; }
    public Integer getAvailableBeds()                          { return availableBeds; }
    public void    setAvailableBeds(Integer v)                 { this.availableBeds = v; }
    public Integer getIcuBeds()                                { return icuBeds; }
    public void    setIcuBeds(Integer v)                       { this.icuBeds = v; }
    public Integer getAvailableIcuBeds()                       { return availableIcuBeds; }
    public void    setAvailableIcuBeds(Integer v)              { this.availableIcuBeds = v; }
    public Integer getBloodUnits()                             { return bloodUnits; }
    public void    setBloodUnits(Integer v)                    { this.bloodUnits = v; }
    public Integer getEmergencyDoctors()                       { return emergencyDoctors; }
    public void    setEmergencyDoctors(Integer v)              { this.emergencyDoctors = v; }
    public Boolean getEmergencyRoomAvailable()                 { return emergencyRoomAvailable; }
    public void    setEmergencyRoomAvailable(Boolean v)        { this.emergencyRoomAvailable = v; }
    public List<HospitalBed> getBeds()                         { return beds; }
    public List<Ambulance>   getAmbulances()                   { return ambulances; }
}
