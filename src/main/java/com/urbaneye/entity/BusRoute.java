package com.urbaneye.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bus_routes")
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_number", nullable = false, unique = true, length = 20)
    private String routeNumber; // e.g. "21A"

    @Column(name = "route_name", nullable = false, length = 150)
    private String routeName;   // e.g. "Guntur → Amaravati Express"

    @Column(name = "start_point", nullable = false, length = 100)
    private String startPoint;  // e.g. "Guntur Bus Stand"

    @Column(nullable = false, length = 100)
    private String destination; // e.g. "Amaravati"

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sequenceNumber ASC")
    private List<BusStop> stops = new ArrayList<>();

    public BusRoute() {}

    private BusRoute(Builder b) {
        this.routeNumber = b.routeNumber;
        this.routeName   = b.routeName;
        this.startPoint  = b.startPoint;
        this.destination = b.destination;
        if (b.stops != null) {
            this.stops = b.stops;
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String routeNumber, routeName, startPoint, destination;
        private List<BusStop> stops = new ArrayList<>();

        public Builder routeNumber(String v) { this.routeNumber = v; return this; }
        public Builder routeName(String v)   { this.routeName   = v; return this; }
        public Builder startPoint(String v)  { this.startPoint  = v; return this; }
        public Builder destination(String v) { this.destination = v; return this; }
        public Builder stops(List<BusStop> v){ this.stops       = v; return this; }
        public BusRoute build() { return new BusRoute(this); }
    }

    public Long getId() { return id; }
    public String getRouteNumber() { return routeNumber; }
    public void setRouteNumber(String v) { this.routeNumber = v; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String v) { this.routeName = v; }
    public String getStartPoint() { return startPoint; }
    public void setStartPoint(String v) { this.startPoint = v; }
    public String getDestination() { return destination; }
    public void setDestination(String v) { this.destination = v; }
    public List<BusStop> getStops() { return stops; }
    public void setStops(List<BusStop> v) { this.stops = v; }
}
