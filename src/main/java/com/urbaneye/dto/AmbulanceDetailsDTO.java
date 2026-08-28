package com.urbaneye.dto;

/**
 * Full ambulance detail returned when a user clicks an ambulance marker.
 *
 * Used by GET /api/ambulances/{number}/details
 *
 * Powers the info card:
 * ┌──────────────────────────┐
 * │ 🚑 AMB-101              │
 * │ Driver: Ramesh Kumar     │
 * │ 📞 +91xxxxxxxxxx         │
 * │ Distance: 1.2 km         │
 * │ ETA: 3 min               │
 * │ Type: ALS | AVAILABLE    │
 * │ Hospital: City General   │
 * │ [ CALL ] [ REQUEST ]     │
 * └──────────────────────────┘
 */
public class AmbulanceDetailsDTO {

    // ── Ambulance ─────────────────────────────────────────────────────────────
    private String  ambulanceNumber;
    private String  vehicleType;       // ALS / BLS / ICU
    private String  status;

    private Double  latitude;
    private Double  longitude;
    private Double  speed;

    // ── Driver ────────────────────────────────────────────────────────────────
    private String  driverName;
    private String  driverPhone;
    private String  licenseNumber;
    private Double  driverRating;

    // ── Hospital ──────────────────────────────────────────────────────────────
    private Long    hospitalId;
    private String  hospitalName;
    private String  hospitalAddress;
    private String  hospitalPhone;
    private Boolean emergencyRoomAvailable;

    // ── Calculated ────────────────────────────────────────────────────────────
    private Double  distanceKm;
    private Integer etaMinutes;

    public AmbulanceDetailsDTO() {}

    private AmbulanceDetailsDTO(Builder b) {
        this.ambulanceNumber       = b.ambulanceNumber;
        this.vehicleType           = b.vehicleType;
        this.status                = b.status;
        this.latitude              = b.latitude;
        this.longitude             = b.longitude;
        this.speed                 = b.speed;
        this.driverName            = b.driverName;
        this.driverPhone           = b.driverPhone;
        this.licenseNumber         = b.licenseNumber;
        this.driverRating          = b.driverRating;
        this.hospitalId            = b.hospitalId;
        this.hospitalName          = b.hospitalName;
        this.hospitalAddress       = b.hospitalAddress;
        this.hospitalPhone         = b.hospitalPhone;
        this.emergencyRoomAvailable= b.emergencyRoomAvailable;
        this.distanceKm            = b.distanceKm;
        this.etaMinutes            = b.etaMinutes;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  ambulanceNumber, vehicleType, status;
        private Double  latitude, longitude, speed;
        private String  driverName, driverPhone, licenseNumber;
        private Double  driverRating;
        private Long    hospitalId;
        private String  hospitalName, hospitalAddress, hospitalPhone;
        private Boolean emergencyRoomAvailable;
        private Double  distanceKm;
        private Integer etaMinutes;

        public Builder ambulanceNumber(String v)        { this.ambulanceNumber        = v; return this; }
        public Builder vehicleType(String v)            { this.vehicleType            = v; return this; }
        public Builder status(String v)                 { this.status                 = v; return this; }
        public Builder latitude(Double v)               { this.latitude               = v; return this; }
        public Builder longitude(Double v)              { this.longitude              = v; return this; }
        public Builder speed(Double v)                  { this.speed                  = v; return this; }
        public Builder driverName(String v)             { this.driverName             = v; return this; }
        public Builder driverPhone(String v)            { this.driverPhone            = v; return this; }
        public Builder licenseNumber(String v)          { this.licenseNumber          = v; return this; }
        public Builder driverRating(Double v)           { this.driverRating           = v; return this; }
        public Builder hospitalId(Long v)               { this.hospitalId             = v; return this; }
        public Builder hospitalName(String v)           { this.hospitalName           = v; return this; }
        public Builder hospitalAddress(String v)        { this.hospitalAddress        = v; return this; }
        public Builder hospitalPhone(String v)          { this.hospitalPhone          = v; return this; }
        public Builder emergencyRoomAvailable(Boolean v){ this.emergencyRoomAvailable = v; return this; }
        public Builder distanceKm(Double v)             { this.distanceKm             = v; return this; }
        public Builder etaMinutes(Integer v)            { this.etaMinutes             = v; return this; }
        public AmbulanceDetailsDTO build()              { return new AmbulanceDetailsDTO(this); }
    }

    // ── Getters ───────────────────────────────────────────────────────────────
    public String  getAmbulanceNumber()        { return ambulanceNumber; }
    public String  getVehicleType()            { return vehicleType; }
    public String  getStatus()                 { return status; }
    public Double  getLatitude()               { return latitude; }
    public Double  getLongitude()              { return longitude; }
    public Double  getSpeed()                  { return speed; }
    public String  getDriverName()             { return driverName; }
    public String  getDriverPhone()            { return driverPhone; }
    public String  getLicenseNumber()          { return licenseNumber; }
    public Double  getDriverRating()           { return driverRating; }
    public Long    getHospitalId()             { return hospitalId; }
    public String  getHospitalName()           { return hospitalName; }
    public String  getHospitalAddress()        { return hospitalAddress; }
    public String  getHospitalPhone()          { return hospitalPhone; }
    public Boolean getEmergencyRoomAvailable() { return emergencyRoomAvailable; }
    public Double  getDistanceKm()             { return distanceKm; }
    public Integer getEtaMinutes()             { return etaMinutes; }
}
