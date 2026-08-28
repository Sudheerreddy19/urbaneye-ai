package com.urbaneye.entity;

import com.urbaneye.entity.enums.BedStatus;
import com.urbaneye.entity.enums.BedType;
import jakarta.persistence.*;

@Entity
@Table(name = "hospital_beds")
public class HospitalBed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(name = "bed_type", nullable = false, length = 20)
    private BedType bedType = BedType.GENERAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BedStatus status = BedStatus.AVAILABLE;

    public HospitalBed() {}

    private HospitalBed(Builder b) {
        this.hospital = b.hospital;
        this.bedType  = b.bedType != null ? b.bedType : BedType.GENERAL;
        this.status   = b.status  != null ? b.status  : BedStatus.AVAILABLE;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Hospital  hospital;
        private BedType   bedType;
        private BedStatus status;

        public Builder hospital(Hospital v)  { this.hospital = v; return this; }
        public Builder bedType(BedType v)    { this.bedType  = v; return this; }
        public Builder status(BedStatus v)   { this.status   = v; return this; }
        public HospitalBed build()           { return new HospitalBed(this); }
    }

    public Long      getId()               { return id; }
    public Hospital  getHospital()         { return hospital; }
    public void      setHospital(Hospital v){ this.hospital = v; }
    public BedType   getBedType()          { return bedType; }
    public void      setBedType(BedType v) { this.bedType = v; }
    public BedStatus getStatus()           { return status; }
    public void      setStatus(BedStatus v){ this.status = v; }
}
