package com.urbaneye.dto;

/**
 * Detailed information for the user when clicking on a bus marker.
 *
 * ┌─────────────────────────┐
 * │ 🚌 BUS 21A              │
 * │ Guntur → Amaravati      │
 * │ 📍 400 m away           │
 * │ ⏱ ETA: 3 min            │
 * │ Occupancy               │
 * │ ███████░░░ 72%          │
 * │ 🟡 Moderate             │
 * │ Next Stop               │
 * │ Metro Wholesale Market  │
 * └─────────────────────────┘
 */
public class BusDetailsDTO {

    private String  busNumber;
    private String  registrationNumber;
    private String  routeNumber;
    private String  routeName;
    private Double  latitude;
    private Double  longitude;
    private Double  speed;
    private String  status;
    private Integer passengers;
    private Integer capacity;
    private Double  occupancyPercentage;
    private String  occupancyLevel; // LOW, MODERATE, CROWDED
    private String  nextStopName;
    private Double  distanceKm;
    private Integer etaMinutes;

    public BusDetailsDTO() {}

    private BusDetailsDTO(Builder b) {
        this.busNumber           = b.busNumber;
        this.registrationNumber  = b.registrationNumber;
        this.routeNumber         = b.routeNumber;
        this.routeName           = b.routeName;
        this.latitude            = b.latitude;
        this.longitude           = b.longitude;
        this.speed               = b.speed;
        this.status              = b.status;
        this.passengers          = b.passengers;
        this.capacity            = b.capacity;
        this.occupancyPercentage = b.occupancyPercentage;
        this.occupancyLevel      = b.occupancyLevel;
        this.nextStopName        = b.nextStopName;
        this.distanceKm          = b.distanceKm;
        this.etaMinutes          = b.etaMinutes;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  busNumber, registrationNumber, routeNumber, routeName, status, occupancyLevel, nextStopName;
        private Double  latitude, longitude, speed, occupancyPercentage, distanceKm;
        private Integer passengers, capacity, etaMinutes;

        public Builder busNumber(String v)           { this.busNumber           = v; return this; }
        public Builder registrationNumber(String v)  { this.registrationNumber  = v; return this; }
        public Builder routeNumber(String v)         { this.routeNumber         = v; return this; }
        public Builder routeName(String v)           { this.routeName           = v; return this; }
        public Builder latitude(Double v)            { this.latitude            = v; return this; }
        public Builder longitude(Double v)           { this.longitude           = v; return this; }
        public Builder speed(Double v)               { this.speed               = v; return this; }
        public Builder status(String v)              { this.status              = v; return this; }
        public Builder passengers(Integer v)         { this.passengers          = v; return this; }
        public Builder capacity(Integer v)           { this.capacity            = v; return this; }
        public Builder occupancyPercentage(Double v) { this.occupancyPercentage = v; return this; }
        public Builder occupancyLevel(String v)      { this.occupancyLevel      = v; return this; }
        public Builder nextStopName(String v)        { this.nextStopName        = v; return this; }
        public Builder distanceKm(Double v)          { this.distanceKm          = v; return this; }
        public Builder etaMinutes(Integer v)         { this.etaMinutes          = v; return this; }
        public BusDetailsDTO build()                 { return new BusDetailsDTO(this); }
    }

    public String  getBusNumber()           { return busNumber; }
    public String  getRegistrationNumber()  { return registrationNumber; }
    public String  getRouteNumber()         { return routeNumber; }
    public String  getRouteName()           { return routeName; }
    public Double  getLatitude()            { return latitude; }
    public Double  getLongitude()           { return longitude; }
    public Double  getSpeed()               { return speed; }
    public String  getStatus()              { return status; }
    public Integer getPassengers()          { return passengers; }
    public Integer getCapacity()            { return capacity; }
    public Double  getOccupancyPercentage() { return occupancyPercentage; }
    public String  getOccupancyLevel()      { return occupancyLevel; }
    public String  getNextStopName()        { return nextStopName; }
    public Double  getDistanceKm()          { return distanceKm; }
    public Integer getEtaMinutes()          { return etaMinutes; }
}
