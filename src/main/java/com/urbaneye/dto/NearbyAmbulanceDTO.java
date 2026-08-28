package com.urbaneye.dto;

/**
 * Response DTO for GET /api/ambulances/nearby
 */
public class NearbyAmbulanceDTO {

    private String  ambulanceNumber;
    private String  driverName;
    private String  driverPhone;
    private Double  latitude;
    private Double  longitude;
    private Double  distance;
    private Integer eta;
    private String  type;
    private String  status;
    private Double  rating;

    public NearbyAmbulanceDTO() {}

    private NearbyAmbulanceDTO(Builder b) {
        this.ambulanceNumber = b.ambulanceNumber;
        this.driverName      = b.driverName;
        this.driverPhone     = b.driverPhone;
        this.latitude        = b.latitude;
        this.longitude       = b.longitude;
        this.distance        = b.distance;
        this.eta             = b.eta;
        this.type            = b.type;
        this.status          = b.status;
        this.rating          = b.rating;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  ambulanceNumber;
        private String  driverName;
        private String  driverPhone;
        private Double  latitude;
        private Double  longitude;
        private Double  distance;
        private Integer eta;
        private String  type;
        private String  status;
        private Double  rating;

        public Builder ambulanceNumber(String v)  { this.ambulanceNumber = v; return this; }
        public Builder driverName(String v)       { this.driverName      = v; return this; }
        public Builder driverPhone(String v)      { this.driverPhone     = v; return this; }
        public Builder latitude(Double v)         { this.latitude        = v; return this; }
        public Builder longitude(Double v)        { this.longitude       = v; return this; }
        public Builder distance(Double v)         { this.distance        = v; return this; }
        public Builder eta(Integer v)             { this.eta             = v; return this; }
        public Builder type(String v)             { this.type            = v; return this; }
        public Builder status(String v)           { this.status          = v; return this; }
        public Builder rating(Double v)           { this.rating          = v; return this; }
        public NearbyAmbulanceDTO build()         { return new NearbyAmbulanceDTO(this); }
    }

    public String  getAmbulanceNumber()             { return ambulanceNumber; }
    public String  getDriverName()                  { return driverName; }
    public String  getDriverPhone()                 { return driverPhone; }
    public Double  getLatitude()                    { return latitude; }
    public Double  getLongitude()                   { return longitude; }
    public Double  getDistance()                    { return distance; }
    public Integer getEta()                         { return eta; }
    public String  getType()                        { return type; }
    public String  getStatus()                      { return status; }
    public Double  getRating()                      { return rating; }
}
