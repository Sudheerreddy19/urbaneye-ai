package com.urbaneye.dto;

public class HospitalCapacityDTO {

    private Long    hospitalId;
    private String  hospitalName;
    private Integer totalBeds;
    private Integer availableBeds;
    private Integer icuBeds;
    private Integer availableIcuBeds;
    private Integer bloodUnits;
    private Integer emergencyDoctors;
    private Boolean emergencyRoomAvailable;
    private Integer incomingAmbulancesCount;

    public HospitalCapacityDTO() {}

    private HospitalCapacityDTO(Builder b) {
        this.hospitalId              = b.hospitalId;
        this.hospitalName            = b.hospitalName;
        this.totalBeds               = b.totalBeds;
        this.availableBeds           = b.availableBeds;
        this.icuBeds                 = b.icuBeds;
        this.availableIcuBeds        = b.availableIcuBeds;
        this.bloodUnits              = b.bloodUnits;
        this.emergencyDoctors        = b.emergencyDoctors;
        this.emergencyRoomAvailable  = b.emergencyRoomAvailable;
        this.incomingAmbulancesCount = b.incomingAmbulancesCount;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long    hospitalId;
        private String  hospitalName;
        private Integer totalBeds, availableBeds, icuBeds, availableIcuBeds, bloodUnits, emergencyDoctors, incomingAmbulancesCount;
        private Boolean emergencyRoomAvailable;

        public Builder hospitalId(Long v)              { this.hospitalId              = v; return this; }
        public Builder hospitalName(String v)          { this.hospitalName            = v; return this; }
        public Builder totalBeds(Integer v)            { this.totalBeds               = v; return this; }
        public Builder availableBeds(Integer v)        { this.availableBeds           = v; return this; }
        public Builder icuBeds(Integer v)              { this.icuBeds                 = v; return this; }
        public Builder availableIcuBeds(Integer v)     { this.availableIcuBeds        = v; return this; }
        public Builder bloodUnits(Integer v)           { this.bloodUnits              = v; return this; }
        public Builder emergencyDoctors(Integer v)     { this.emergencyDoctors        = v; return this; }
        public Builder emergencyRoomAvailable(Boolean v){ this.emergencyRoomAvailable = v; return this; }
        public Builder incomingAmbulancesCount(Integer v){ this.incomingAmbulancesCount= v; return this; }
        public HospitalCapacityDTO build()             { return new HospitalCapacityDTO(this); }
    }

    public Long    getHospitalId()              { return hospitalId; }
    public String  getHospitalName()            { return hospitalName; }
    public Integer getTotalBeds()               { return totalBeds; }
    public Integer getAvailableBeds()           { return availableBeds; }
    public Integer getIcuBeds()                 { return icuBeds; }
    public Integer getAvailableIcuBeds()        { return availableIcuBeds; }
    public Integer getBloodUnits()              { return bloodUnits; }
    public Integer getEmergencyDoctors()        { return emergencyDoctors; }
    public Boolean getEmergencyRoomAvailable()  { return emergencyRoomAvailable; }
    public Integer getIncomingAmbulancesCount() { return incomingAmbulancesCount; }
}
