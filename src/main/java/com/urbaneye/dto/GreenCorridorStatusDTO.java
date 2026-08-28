package com.urbaneye.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Real-time status of an active green corridor route.
 *
 * 🚨 EMERGENCY GREEN CORRIDOR
 * Ambulance: AMB-101
 * Destination: Guntur Government Hospital
 *
 * 🚦 SIGNAL-01 🟢 FORCED GREEN (180m)
 * 🚦 SIGNAL-02 🔴 NORMAL (520m)
 * 🚦 SIGNAL-03 🔴 NORMAL (890m)
 * 🚦 SIGNAL-04 🔴 NORMAL (1.2km)
 */
public class GreenCorridorStatusDTO {

    private String corridorCode;
    private String name;
    private String ambulanceNumber;
    private String destinationHospitalName;
    private String status;
    private String nextSignalCode;
    private Long   nextSignalDistanceMeters;
    private Integer activeForcedGreenCount;
    private List<CorridorSignalStatusDTO> signals = new ArrayList<>();

    public GreenCorridorStatusDTO() {}

    private GreenCorridorStatusDTO(Builder b) {
        this.corridorCode              = b.corridorCode;
        this.name                      = b.name;
        this.ambulanceNumber           = b.ambulanceNumber;
        this.destinationHospitalName   = b.destinationHospitalName;
        this.status                    = b.status;
        this.nextSignalCode            = b.nextSignalCode;
        this.nextSignalDistanceMeters  = b.nextSignalDistanceMeters;
        this.activeForcedGreenCount    = b.activeForcedGreenCount != null ? b.activeForcedGreenCount : 0;
        if (b.signals != null) {
            this.signals = b.signals;
        }
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String corridorCode, name, ambulanceNumber, destinationHospitalName, status, nextSignalCode;
        private Long   nextSignalDistanceMeters;
        private Integer activeForcedGreenCount;
        private List<CorridorSignalStatusDTO> signals = new ArrayList<>();

        public Builder corridorCode(String v)            { this.corridorCode              = v; return this; }
        public Builder name(String v)                    { this.name                      = v; return this; }
        public Builder ambulanceNumber(String v)         { this.ambulanceNumber           = v; return this; }
        public Builder destinationHospitalName(String v) { this.destinationHospitalName   = v; return this; }
        public Builder status(String v)                  { this.status                    = v; return this; }
        public Builder nextSignalCode(String v)          { this.nextSignalCode            = v; return this; }
        public Builder nextSignalDistanceMeters(Long v)  { this.nextSignalDistanceMeters  = v; return this; }
        public Builder activeForcedGreenCount(Integer v) { this.activeForcedGreenCount    = v; return this; }
        public Builder signals(List<CorridorSignalStatusDTO> v) { this.signals            = v; return this; }
        public GreenCorridorStatusDTO build()            { return new GreenCorridorStatusDTO(this); }
    }

    public String getCorridorCode() { return corridorCode; }
    public String getName() { return name; }
    public String getAmbulanceNumber() { return ambulanceNumber; }
    public String getDestinationHospitalName() { return destinationHospitalName; }
    public String getStatus() { return status; }
    public String getNextSignalCode() { return nextSignalCode; }
    public Long getNextSignalDistanceMeters() { return nextSignalDistanceMeters; }
    public Integer getActiveForcedGreenCount() { return activeForcedGreenCount; }
    public List<CorridorSignalStatusDTO> getSignals() { return signals; }
}
