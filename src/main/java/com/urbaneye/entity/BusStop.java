package com.urbaneye.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "bus_stops")
public class BusStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stop_name", nullable = false, length = 100)
    private String stopName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "sequence_number", nullable = false)
    private Integer sequenceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    @JsonIgnore
    private BusRoute route;

    public BusStop() {}

    private BusStop(Builder b) {
        this.stopName       = b.stopName;
        this.latitude       = b.latitude;
        this.longitude      = b.longitude;
        this.sequenceNumber = b.sequenceNumber;
        this.route          = b.route;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String   stopName;
        private Double   latitude, longitude;
        private Integer  sequenceNumber;
        private BusRoute route;

        public Builder stopName(String v)       { this.stopName       = v; return this; }
        public Builder latitude(Double v)       { this.latitude       = v; return this; }
        public Builder longitude(Double v)      { this.longitude      = v; return this; }
        public Builder sequenceNumber(Integer v){ this.sequenceNumber = v; return this; }
        public Builder route(BusRoute v)        { this.route          = v; return this; }
        public BusStop build()                  { return new BusStop(this); }
    }

    public Long getId() { return id; }
    public String getStopName() { return stopName; }
    public void setStopName(String v) { this.stopName = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public Integer getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Integer v) { this.sequenceNumber = v; }
    public BusRoute getRoute() { return route; }
    public void setRoute(BusRoute v) { this.route = v; }
}
