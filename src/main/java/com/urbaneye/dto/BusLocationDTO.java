package com.urbaneye.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for bus GPS location update events.
 */
public class BusLocationDTO {

    @NotBlank(message = "Bus ID is required")
    private String  busId;
    @NotNull(message = "Latitude is required")
    private Double  latitude;
    @NotNull(message = "Longitude is required")
    private Double  longitude;
    private Double  speed;
    private Integer passengers;
    private String  status;
    private Long    timestamp;

    public BusLocationDTO() {}

    public BusLocationDTO(String busId, Double latitude, Double longitude,
                          Double speed, Integer passengers, String status, Long timestamp) {
        this.busId      = busId;
        this.latitude   = latitude;
        this.longitude  = longitude;
        this.speed      = speed;
        this.passengers = passengers;
        this.status     = status;
        this.timestamp  = timestamp;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  busId;
        private Double  latitude;
        private Double  longitude;
        private Double  speed;
        private Integer passengers;
        private String  status;
        private Long    timestamp;

        public Builder busId(String v)       { this.busId      = v; return this; }
        public Builder latitude(Double v)    { this.latitude   = v; return this; }
        public Builder longitude(Double v)   { this.longitude  = v; return this; }
        public Builder speed(Double v)       { this.speed      = v; return this; }
        public Builder passengers(Integer v) { this.passengers = v; return this; }
        public Builder status(String v)      { this.status     = v; return this; }
        public Builder timestamp(Long v)     { this.timestamp  = v; return this; }
        public BusLocationDTO build() {
            return new BusLocationDTO(busId, latitude, longitude, speed, passengers, status, timestamp);
        }
    }

    public String  getBusId()               { return busId; }
    public void    setBusId(String v)       { this.busId = v; }
    public Double  getLatitude()            { return latitude; }
    public void    setLatitude(Double v)    { this.latitude = v; }
    public Double  getLongitude()           { return longitude; }
    public void    setLongitude(Double v)   { this.longitude = v; }
    public Double  getSpeed()               { return speed; }
    public void    setSpeed(Double v)       { this.speed = v; }
    public Integer getPassengers()          { return passengers; }
    public void    setPassengers(Integer v) { this.passengers = v; }
    public String  getStatus()              { return status; }
    public void    setStatus(String v)      { this.status = v; }
    public Long    getTimestamp()           { return timestamp; }
    public void    setTimestamp(Long v)     { this.timestamp = v; }
}
