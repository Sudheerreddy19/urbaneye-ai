package com.urbaneye.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for ambulance GPS location update events.
 */
public class AmbulanceLocationDTO {

    @NotBlank(message = "Ambulance ID is required")
    private String ambulanceId;
    @NotNull(message = "Latitude is required")
    private Double latitude;
    @NotNull(message = "Longitude is required")
    private Double longitude;
    private Double speed;
    private String status;
    private Long   timestamp;

    public AmbulanceLocationDTO() {}

    public AmbulanceLocationDTO(String ambulanceId, Double latitude, Double longitude,
                                Double speed, String status, Long timestamp) {
        this.ambulanceId = ambulanceId;
        this.latitude    = latitude;
        this.longitude   = longitude;
        this.speed       = speed;
        this.status      = status;
        this.timestamp   = timestamp;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String ambulanceId;
        private Double latitude;
        private Double longitude;
        private Double speed;
        private String status;
        private Long   timestamp;

        public Builder ambulanceId(String v) { this.ambulanceId = v; return this; }
        public Builder latitude(Double v)    { this.latitude    = v; return this; }
        public Builder longitude(Double v)   { this.longitude   = v; return this; }
        public Builder speed(Double v)       { this.speed       = v; return this; }
        public Builder status(String v)      { this.status      = v; return this; }
        public Builder timestamp(Long v)     { this.timestamp   = v; return this; }
        public AmbulanceLocationDTO build()  {
            return new AmbulanceLocationDTO(ambulanceId, latitude, longitude, speed, status, timestamp);
        }
    }

    public String getAmbulanceId()            { return ambulanceId; }
    public void setAmbulanceId(String v)      { this.ambulanceId = v; }
    public Double getLatitude()               { return latitude; }
    public void setLatitude(Double v)         { this.latitude = v; }
    public Double getLongitude()              { return longitude; }
    public void setLongitude(Double v)        { this.longitude = v; }
    public Double getSpeed()                  { return speed; }
    public void setSpeed(Double v)            { this.speed = v; }
    public String getStatus()                 { return status; }
    public void setStatus(String v)           { this.status = v; }
    public Long getTimestamp()                { return timestamp; }
    public void setTimestamp(Long v)          { this.timestamp = v; }
}
