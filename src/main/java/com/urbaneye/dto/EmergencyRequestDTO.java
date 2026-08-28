package com.urbaneye.dto;

import com.urbaneye.entity.enums.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for POST /api/emergency/request
 */
public class EmergencyRequestDTO {

    @NotBlank(message = "Ambulance number is required")
    private String ambulanceNumber;

    @NotNull(message = "Pickup latitude is required")
    private Double pickupLatitude;

    @NotNull(message = "Pickup longitude is required")
    private Double pickupLongitude;

    private String           patientName;
    private String           description;
    private IncidentSeverity severity = IncidentSeverity.HIGH;
    private Long             hospitalId;

    public EmergencyRequestDTO() {}

    public String           getAmbulanceNumber()                   { return ambulanceNumber; }
    public void             setAmbulanceNumber(String v)           { this.ambulanceNumber = v; }
    public Double           getPickupLatitude()                    { return pickupLatitude; }
    public void             setPickupLatitude(Double v)            { this.pickupLatitude = v; }
    public Double           getPickupLongitude()                   { return pickupLongitude; }
    public void             setPickupLongitude(Double v)           { this.pickupLongitude = v; }
    public String           getPatientName()                       { return patientName; }
    public void             setPatientName(String v)               { this.patientName = v; }
    public String           getDescription()                       { return description; }
    public void             setDescription(String v)               { this.description = v; }
    public IncidentSeverity getSeverity()                          { return severity; }
    public void             setSeverity(IncidentSeverity v)        { this.severity = v; }
    public Long             getHospitalId()                        { return hospitalId; }
    public void             setHospitalId(Long v)                  { this.hospitalId = v; }
}
