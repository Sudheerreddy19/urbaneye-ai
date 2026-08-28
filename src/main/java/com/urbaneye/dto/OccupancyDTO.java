package com.urbaneye.dto;

/**
 * DTO for bus occupancy information.
 */
public class OccupancyDTO {

    private String  busId;
    private Integer passengers;
    private Integer capacity;

    public OccupancyDTO() {}

    public OccupancyDTO(String busId, Integer passengers, Integer capacity) {
        this.busId      = busId;
        this.passengers = passengers;
        this.capacity   = capacity;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  busId;
        private Integer passengers;
        private Integer capacity;

        public Builder busId(String v)       { this.busId      = v; return this; }
        public Builder passengers(Integer v) { this.passengers = v; return this; }
        public Builder capacity(Integer v)   { this.capacity   = v; return this; }
        public OccupancyDTO build() { return new OccupancyDTO(busId, passengers, capacity); }
    }

    public String  getBusId()              { return busId; }
    public void    setBusId(String v)      { this.busId = v; }
    public Integer getPassengers()         { return passengers; }
    public void    setPassengers(Integer v){ this.passengers = v; }
    public Integer getCapacity()           { return capacity; }
    public void    setCapacity(Integer v)  { this.capacity = v; }

    public Double getOccupancyPercentage() {
        if (capacity == null || capacity == 0) return 0.0;
        return Math.round((passengers.doubleValue() / capacity) * 1000.0) / 10.0;
    }

    public String getOccupancyLevel() {
        double pct = getOccupancyPercentage();
        if (pct < 40) return "LOW";
        if (pct < 70) return "MODERATE";
        if (pct < 90) return "HIGH";
        return "FULL";
    }
}
