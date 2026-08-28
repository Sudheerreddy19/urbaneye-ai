package com.urbaneye.dto;

import com.urbaneye.entity.enums.IncidentSeverity;
import com.urbaneye.entity.enums.IncidentType;
import jakarta.validation.constraints.NotNull;

/**
 * Request/response DTO for incident reporting.
 */
public class IncidentDTO {

    @NotNull(message = "Incident type is required")
    private IncidentType type;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String description;

    @NotNull(message = "Severity is required")
    private IncidentSeverity severity;

    public IncidentDTO() {}

    public IncidentDTO(IncidentType type, Double latitude, Double longitude,
                       String description, IncidentSeverity severity) {
        this.type        = type;
        this.latitude    = latitude;
        this.longitude   = longitude;
        this.description = description;
        this.severity    = severity;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private IncidentType     type;
        private Double           latitude;
        private Double           longitude;
        private String           description;
        private IncidentSeverity severity;

        public Builder type(IncidentType v)         { this.type        = v; return this; }
        public Builder latitude(Double v)           { this.latitude    = v; return this; }
        public Builder longitude(Double v)          { this.longitude   = v; return this; }
        public Builder description(String v)        { this.description = v; return this; }
        public Builder severity(IncidentSeverity v) { this.severity    = v; return this; }
        public IncidentDTO build() {
            return new IncidentDTO(type, latitude, longitude, description, severity);
        }
    }

    public IncidentType     getType()                    { return type; }
    public void             setType(IncidentType v)      { this.type = v; }
    public Double           getLatitude()                { return latitude; }
    public void             setLatitude(Double v)        { this.latitude = v; }
    public Double           getLongitude()               { return longitude; }
    public void             setLongitude(Double v)       { this.longitude = v; }
    public String           getDescription()             { return description; }
    public void             setDescription(String v)     { this.description = v; }
    public IncidentSeverity getSeverity()                { return severity; }
    public void             setSeverity(IncidentSeverity v) { this.severity = v; }
}
