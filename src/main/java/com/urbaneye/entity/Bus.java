package com.urbaneye.entity;

import com.urbaneye.entity.enums.BusStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true, length = 20)
    private String busNumber; // e.g. "21A"

    @Column(name = "registration_number", length = 30)
    private String registrationNumber; // e.g. "AP07-TG-1234"

    @Column(length = 200)
    private String route; // e.g. "Guntur → Amaravati"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_route_id")
    private BusRoute busRoute;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "next_stop_id")
    private BusStop nextStop;

    private Double  latitude;
    private Double  longitude;
    private Double  speed      = 0.0;
    private Integer passengers = 0;
    private Integer capacity   = 50;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusStatus status = BusStatus.ACTIVE;

    public Bus() {}

    private Bus(Builder b) {
        this.busNumber          = b.busNumber;
        this.registrationNumber = b.registrationNumber;
        this.route              = b.route;
        this.busRoute           = b.busRoute;
        this.nextStop           = b.nextStop;
        this.latitude           = b.latitude;
        this.longitude          = b.longitude;
        this.speed              = b.speed      != null ? b.speed      : 0.0;
        this.passengers         = b.passengers != null ? b.passengers : 0;
        this.capacity           = b.capacity   != null ? b.capacity   : 50;
        this.status             = b.status     != null ? b.status     : BusStatus.ACTIVE;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String    busNumber, registrationNumber, route;
        private BusRoute  busRoute;
        private BusStop   nextStop;
        private Double    latitude, longitude, speed;
        private Integer   passengers, capacity;
        private BusStatus status;

        public Builder busNumber(String v)          { this.busNumber          = v; return this; }
        public Builder registrationNumber(String v) { this.registrationNumber = v; return this; }
        public Builder route(String v)              { this.route              = v; return this; }
        public Builder busRoute(BusRoute v)         { this.busRoute           = v; return this; }
        public Builder nextStop(BusStop v)          { this.nextStop           = v; return this; }
        public Builder latitude(Double v)           { this.latitude           = v; return this; }
        public Builder longitude(Double v)          { this.longitude          = v; return this; }
        public Builder speed(Double v)              { this.speed              = v; return this; }
        public Builder passengers(Integer v)        { this.passengers         = v; return this; }
        public Builder capacity(Integer v)          { this.capacity           = v; return this; }
        public Builder status(BusStatus v)          { this.status             = v; return this; }
        public Bus build()                          { return new Bus(this); }
    }

    public Long getId() { return id; }
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String v) { this.busNumber = v; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String v) { this.registrationNumber = v; }
    public String getRoute() { return route; }
    public void setRoute(String v) { this.route = v; }
    public BusRoute getBusRoute() { return busRoute; }
    public void setBusRoute(BusRoute v) { this.busRoute = v; }
    public BusStop getNextStop() { return nextStop; }
    public void setNextStop(BusStop v) { this.nextStop = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public Double getSpeed() { return speed; }
    public void setSpeed(Double v) { this.speed = v; }
    public Integer getPassengers() { return passengers; }
    public void setPassengers(Integer v) { this.passengers = v; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer v) { this.capacity = v; }
    public BusStatus getStatus() { return status; }
    public void setStatus(BusStatus v) { this.status = v; }

    public Double getOccupancyPercentage() {
        if (capacity == null || capacity == 0) return 0.0;
        return Math.round(((double) passengers / capacity) * 1000.0) / 10.0;
    }

    public String getOccupancyLevel() {
        double pct = getOccupancyPercentage();
        if (pct < 50.0) return "LOW";
        if (pct <= 85.0) return "MODERATE";
        return "CROWDED";
    }
}
