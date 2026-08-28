package com.urbaneye;

import com.urbaneye.entity.*;
import com.urbaneye.entity.enums.*;
import com.urbaneye.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with rich sample data for Phase 1, 2, 3, 4, and 5:
 * - 3 Users (USER, POLICE, HOSPITAL) with password "password123"
 * - 3 Hospitals with ICU, Blood units & Emergency doctors
 * - 10 Drivers & 10 Ambulances spread across Guntur (AMB-101 for simulation)
 * - 4 Bus Routes + real stops (Route 21A, 14B, 7C, 33D)
 * - 4 Public Transit Buses (21A simulated in real time)
 * - 5 Road Segments (MG Road, Brodipet Road, Lakshmipuram Road, Ring Road, NH-16)
 * - 10 Traffic Signals
 * - 4 Road Hazards / City Incidents (Pothole, Construction, Waterlogging, Accident)
 * - 1 Emergency Green Corridor (GC-01) + Preemption Audit Logs
 * - 2 Waterlogging Zones (Lakshmipuram Underpass, Brodipet Low Area)
 * - 2 Active Emergency Hospital Cases
 */
@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String DEFAULT_PASSWORD = "password123";

    private final UserRepository             userRepository;
    private final HospitalRepository         hospitalRepository;
    private final DriverRepository           driverRepository;
    private final AmbulanceRepository        ambulanceRepository;
    private final BusRouteRepository         busRouteRepository;
    private final BusStopRepository          busStopRepository;
    private final BusRepository              busRepository;
    private final RoadSegmentRepository      roadSegmentRepository;
    private final TrafficSignalRepository    signalRepository;
    private final HospitalBedRepository      bedRepository;
    private final IncidentRepository         incidentRepository;
    private final GreenCorridorRepository    greenCorridorRepository;
    private final SignalEventRepository      signalEventRepository;
    private final WaterloggingZoneRepository waterloggingZoneRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;
    private final PasswordEncoder            passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           HospitalRepository hospitalRepository,
                           DriverRepository driverRepository,
                           AmbulanceRepository ambulanceRepository,
                           BusRouteRepository busRouteRepository,
                           BusStopRepository busStopRepository,
                           BusRepository busRepository,
                           RoadSegmentRepository roadSegmentRepository,
                           TrafficSignalRepository signalRepository,
                           HospitalBedRepository bedRepository,
                           IncidentRepository incidentRepository,
                           GreenCorridorRepository greenCorridorRepository,
                           SignalEventRepository signalEventRepository,
                           WaterloggingZoneRepository waterloggingZoneRepository,
                           EmergencyRequestRepository emergencyRequestRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository             = userRepository;
        this.hospitalRepository         = hospitalRepository;
        this.driverRepository           = driverRepository;
        this.ambulanceRepository        = ambulanceRepository;
        this.busRouteRepository         = busRouteRepository;
        this.busStopRepository          = busStopRepository;
        this.busRepository              = busRepository;
        this.roadSegmentRepository      = roadSegmentRepository;
        this.signalRepository           = signalRepository;
        this.bedRepository              = bedRepository;
        this.incidentRepository         = incidentRepository;
        this.greenCorridorRepository    = greenCorridorRepository;
        this.signalEventRepository      = signalEventRepository;
        this.waterloggingZoneRepository = waterloggingZoneRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.passwordEncoder            = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            log.info("DB already seeded — skipping DataInitializer.");
            return;
        }
        log.info("🌱 Seeding UrbanEye database for Phase 1 through Phase 5...");
        User user = seedUsers();
        Hospital h1 = seedHospitals();
        Ambulance amb1 = seedDriversAndAmbulances(h1);
        seedRoutesAndBuses();
        seedRoadSegments();
        seedTrafficSignals();
        seedIncidents(user);
        seedGreenCorridor(h1);
        seedWaterloggingZones();
        seedEmergencyCases(user, amb1, h1);
        log.info("✅ Database seeded successfully with complete smart-city emergency & mobility platform.");
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    private User seedUsers() {
        String h = passwordEncoder.encode(DEFAULT_PASSWORD);
        User u1 = userRepository.save(User.builder().name("Sudheer Kumar").email("user@urbaneye.com").phone("+919876543210").password(h).role(Role.USER).build());
        userRepository.save(User.builder().name("Inspector Ravi Shankar").email("police@urbaneye.com").phone("+919876543211").password(h).role(Role.POLICE).build());
        userRepository.save(User.builder().name("Guntur City Hospital Admin").email("hospital@urbaneye.com").phone("+919876543212").password(h).role(Role.HOSPITAL).build());
        log.info("  ✓ Users (3)");
        return u1;
    }

    // ── Hospitals ─────────────────────────────────────────────────────────────

    private Hospital seedHospitals() {
        Hospital h1 = hospitalRepository.save(Hospital.builder()
                .name("Guntur Government Hospital").address("Kothapet, Guntur, AP 522001")
                .latitude(16.3067).longitude(80.4365).phone("+918632222222")
                .totalBeds(500).availableBeds(120).icuBeds(50).availableIcuBeds(15)
                .bloodUnits(28).emergencyDoctors(6)
                .emergencyRoomAvailable(true).build());

        Hospital h2 = hospitalRepository.save(Hospital.builder()
                .name("Apollo Hospital Guntur").address("Brodipet, Guntur, AP 522002")
                .latitude(16.3100).longitude(80.4400).phone("+918632333333")
                .totalBeds(300).availableBeds(80).icuBeds(30).availableIcuBeds(10)
                .bloodUnits(18).emergencyDoctors(4)
                .emergencyRoomAvailable(true).build());

        Hospital h3 = hospitalRepository.save(Hospital.builder()
                .name("KIMS Hospital Guntur").address("Nallacheruvu, Guntur, AP 522007")
                .latitude(16.3020).longitude(80.4320).phone("+918632444444")
                .totalBeds(200).availableBeds(60).icuBeds(20).availableIcuBeds(8)
                .bloodUnits(12).emergencyDoctors(3)
                .emergencyRoomAvailable(true).build());

        for (int i = 0; i < 6; i++) bedRepository.save(HospitalBed.builder().hospital(h1).bedType(BedType.GENERAL).status(BedStatus.AVAILABLE).build());
        for (int i = 0; i < 3; i++) bedRepository.save(HospitalBed.builder().hospital(h1).bedType(BedType.ICU).status(BedStatus.AVAILABLE).build());
        bedRepository.save(HospitalBed.builder().hospital(h1).bedType(BedType.EMERGENCY).status(BedStatus.AVAILABLE).build());

        log.info("  ✓ Hospitals (3) with blood units & emergency doctors");
        return h1;
    }

    // ── Drivers + 10 Ambulances ───────────────────────────────────────────────

    private Ambulance seedDriversAndAmbulances(Hospital h1) {
        Hospital h2 = hospitalRepository.findAll().get(1);
        Hospital h3 = hospitalRepository.findAll().get(2);

        Driver[] drivers = {
            driverRepository.save(Driver.builder().name("Ramesh Kumar").phone("+919876543220").licenseNumber("AP07D1001").rating(4.8).build()),
            driverRepository.save(Driver.builder().name("Suresh Babu").phone("+919876543221").licenseNumber("AP07D1002").rating(4.5).build()),
            driverRepository.save(Driver.builder().name("Venkat Rao").phone("+919876543222").licenseNumber("AP07D1003").rating(4.7).build()),
            driverRepository.save(Driver.builder().name("Krishna Murthy").phone("+919876543223").licenseNumber("AP07D1004").rating(4.6).build()),
            driverRepository.save(Driver.builder().name("Srinivas Reddy").phone("+919876543224").licenseNumber("AP07D1005").rating(4.9).build()),
            driverRepository.save(Driver.builder().name("Prasad Naidu").phone("+919876543225").licenseNumber("AP07D1006").rating(4.4).build()),
            driverRepository.save(Driver.builder().name("Ravi Teja").phone("+919876543226").licenseNumber("AP07D1007").rating(4.3).build()),
            driverRepository.save(Driver.builder().name("Anil Kumar").phone("+919876543227").licenseNumber("AP07D1008").rating(4.7).build()),
            driverRepository.save(Driver.builder().name("Mohan Das").phone("+919876543228").licenseNumber("AP07D1009").rating(4.6).build()),
            driverRepository.save(Driver.builder().name("Bhaskar Rao").phone("+919876543229").licenseNumber("AP07D1010").rating(4.5).build()),
        };

        Object[][] ambulances = {
            {"AMB-101", drivers[0], h1, AmbulanceType.ALS,  AmbulanceStatus.AVAILABLE, 16.3050, 80.4320, 0.0},
            {"AMB-102", drivers[1], h1, AmbulanceType.BLS,  AmbulanceStatus.AVAILABLE, 16.3120, 80.4450, 0.0},
            {"AMB-103", drivers[2], h2, AmbulanceType.ICU,  AmbulanceStatus.AVAILABLE, 16.2990, 80.4280, 0.0},
            {"AMB-104", drivers[3], h2, AmbulanceType.BLS,  AmbulanceStatus.AVAILABLE, 16.3180, 80.4390, 0.0},
            {"AMB-105", drivers[4], h1, AmbulanceType.ALS,  AmbulanceStatus.AVAILABLE, 16.3060, 80.4500, 0.0},
            {"AMB-106", drivers[5], h3, AmbulanceType.BLS,  AmbulanceStatus.BUSY,      16.2940, 80.4260, 35.0},
            {"AMB-107", drivers[6], h3, AmbulanceType.ICU,  AmbulanceStatus.AVAILABLE, 16.3220, 80.4340, 0.0},
            {"AMB-108", drivers[7], h2, AmbulanceType.ALS,  AmbulanceStatus.AVAILABLE, 16.3010, 80.4480, 0.0},
            {"AMB-109", drivers[8], h1, AmbulanceType.BLS,  AmbulanceStatus.OFFLINE,   16.3150, 80.4550, 0.0},
            {"AMB-110", drivers[9], h3, AmbulanceType.ALS,  AmbulanceStatus.AVAILABLE, 16.2970, 80.4350, 0.0},
        };

        Ambulance primary = null;
        for (Object[] a : ambulances) {
            Ambulance amb = ambulanceRepository.save(Ambulance.builder()
                    .ambulanceNumber((String) a[0])
                    .driver((Driver) a[1])
                    .hospital((Hospital) a[2])
                    .ambulanceType((AmbulanceType) a[3])
                    .status((AmbulanceStatus) a[4])
                    .latitude((Double) a[5])
                    .longitude((Double) a[6])
                    .speed((Double) a[7])
                    .build());
            if ("AMB-101".equals(a[0])) {
                primary = amb;
            }
        }

        log.info("  ✓ Drivers (10) + Ambulances (10)");
        return primary;
    }

    // ── Routes, Stops & Buses ─────────────────────────────────────────────────

    private void seedRoutesAndBuses() {
        BusRoute r1 = busRouteRepository.save(BusRoute.builder()
                .routeNumber("21A")
                .routeName("Guntur → Amaravati Express")
                .startPoint("Guntur Bus Stand")
                .destination("Amaravati North")
                .build());

        busStopRepository.save(BusStop.builder().stopName("Guntur Bus Stand").latitude(16.3080).longitude(80.4380).sequenceNumber(1).route(r1).build());
        busStopRepository.save(BusStop.builder().stopName("Lakshmipuram").latitude(16.3120).longitude(80.4420).sequenceNumber(2).route(r1).build());
        busStopRepository.save(BusStop.builder().stopName("Brodipet Center").latitude(16.3150).longitude(80.4450).sequenceNumber(3).route(r1).build());
        BusStop s4 = busStopRepository.save(BusStop.builder().stopName("Metro Wholesale Market").latitude(16.3200).longitude(80.4500).sequenceNumber(4).route(r1).build());
        busStopRepository.save(BusStop.builder().stopName("Amaravati North").latitude(16.3300).longitude(80.4600).sequenceNumber(5).route(r1).build());

        BusRoute r2 = busRouteRepository.save(BusRoute.builder()
                .routeNumber("14B")
                .routeName("Guntur → Vijayawada Highway")
                .startPoint("Guntur RTC Complex")
                .destination("Vijayawada Toll")
                .build());

        busStopRepository.save(BusStop.builder().stopName("Guntur RTC Complex").latitude(16.3120).longitude(80.4420).sequenceNumber(1).route(r2).build());
        busStopRepository.save(BusStop.builder().stopName("Kaza Toll Gate").latitude(16.3250).longitude(80.4600).sequenceNumber(2).route(r2).build());
        busStopRepository.save(BusStop.builder().stopName("Mangalagiri Bypass").latitude(16.4300).longitude(80.5500).sequenceNumber(3).route(r2).build());

        busRouteRepository.save(BusRoute.builder().routeNumber("7C").routeName("Guntur → Narasaraopet").startPoint("Guntur").destination("Narasaraopet").build());
        busRouteRepository.save(BusRoute.builder().routeNumber("33D").routeName("Guntur → Tenali").startPoint("Guntur").destination("Tenali").build());

        busRepository.save(Bus.builder()
                .busNumber("21A")
                .registrationNumber("AP07-TG-2101")
                .route("Guntur → Amaravati")
                .busRoute(r1)
                .nextStop(s4)
                .latitude(16.3080).longitude(80.4380)
                .speed(30.0).passengers(36).capacity(50)
                .status(BusStatus.ACTIVE)
                .build());

        busRepository.save(Bus.builder()
                .busNumber("14B")
                .registrationNumber("AP07-TG-1402")
                .route("Guntur → Vijayawada")
                .busRoute(r2)
                .latitude(16.3120).longitude(80.4420)
                .speed(45.0).passengers(28).capacity(50)
                .status(BusStatus.ACTIVE)
                .build());

        busRepository.save(Bus.builder()
                .busNumber("7C")
                .registrationNumber("AP07-TG-0703")
                .route("Guntur → Narasaraopet")
                .latitude(16.3010).longitude(80.4300)
                .speed(0.0).passengers(0).capacity(50)
                .status(BusStatus.IDLE)
                .build());

        busRepository.save(Bus.builder()
                .busNumber("33D")
                .registrationNumber("AP07-TG-3304")
                .route("Guntur → Tenali")
                .latitude(16.3140).longitude(80.4460)
                .speed(38.0).passengers(42).capacity(50)
                .status(BusStatus.ACTIVE)
                .build());

        log.info("  ✓ Bus Routes (4), Stops (8), Buses (4)");
    }

    // ── Road Segments ─────────────────────────────────────────────────────────

    private void seedRoadSegments() {
        Object[][] segments = {
            {"MG Road",              16.3050, 80.4320, 16.3100, 80.4400,  8.0, 620, TrafficLevel.SEVERE,   88.0},
            {"Brodipet Road",        16.3090, 80.4380, 16.3150, 80.4450, 32.0, 140, TrafficLevel.LOW,      18.0},
            {"Lakshmipuram Main Rd", 16.3110, 80.4410, 16.3180, 80.4480, 18.0, 380, TrafficLevel.HIGH,     65.0},
            {"Inner Ring Road",      16.3000, 80.4250, 16.3200, 80.4350, 24.0, 290, TrafficLevel.MODERATE, 42.0},
            {"NH-16 Express Way",    16.3200, 80.4500, 16.3400, 80.4700, 55.0, 410, TrafficLevel.LOW,      12.0},
        };

        for (Object[] s : segments) {
            roadSegmentRepository.save(RoadSegment.builder()
                    .roadName((String) s[0])
                    .startLat((Double) s[1])
                    .startLon((Double) s[2])
                    .endLat((Double) s[3])
                    .endLon((Double) s[4])
                    .avgSpeed((Double) s[5])
                    .vehicleCount((Integer) s[6])
                    .trafficLevel((TrafficLevel) s[7])
                    .congestionPercentage((Double) s[8])
                    .build());
        }

        log.info("  ✓ Road Segments (5) with traffic levels");
    }

    // ── Traffic Signals ───────────────────────────────────────────────────────

    private void seedTrafficSignals() {
        Object[][] signals = {
            {"SIGNAL-01", 16.3075, 80.4375, SignalState.GREEN,  "Zone A"},
            {"SIGNAL-02", 16.3085, 80.4385, SignalState.RED,    "Zone A"},
            {"SIGNAL-03", 16.3095, 80.4395, SignalState.YELLOW, "Zone B"},
            {"SIGNAL-04", 16.3055, 80.4355, SignalState.RED,    "Zone B"},
            {"SIGNAL-05", 16.3065, 80.4345, SignalState.GREEN,  "Zone C"},
            {"SIGNAL-06", 16.3035, 80.4325, SignalState.RED,    "Zone C"},
            {"SIGNAL-07", 16.3105, 80.4410, SignalState.YELLOW, "Zone A"},
            {"SIGNAL-08", 16.3115, 80.4430, SignalState.GREEN,  "Zone D"},
            {"SIGNAL-09", 16.3048, 80.4305, SignalState.RED,    "Zone C"},
            {"SIGNAL-10", 16.3135, 80.4470, SignalState.GREEN,  "Zone D"},
        };
        for (Object[] s : signals) {
            signalRepository.save(TrafficSignal.builder()
                    .signalCode((String) s[0]).latitude((Double) s[1]).longitude((Double) s[2])
                    .currentState((SignalState) s[3]).zone((String) s[4]).build());
        }
        log.info("  ✓ Traffic signals (10)");
    }

    // ── Road Hazards & Incidents ──────────────────────────────────────────────

    private void seedIncidents(User user) {
        incidentRepository.save(Incident.builder()
                .type(IncidentType.ACCIDENT)
                .latitude(16.3070).longitude(80.4360)
                .description("Two-wheeler collision near MG Road crossing. Traffic bottleneck.")
                .severity(IncidentSeverity.CRITICAL)
                .reportedBy(user)
                .status(IncidentStatus.REPORTED)
                .build());

        incidentRepository.save(Incident.builder()
                .type(IncidentType.POTHOLE)
                .latitude(16.3030).longitude(80.4280)
                .description("Deep pothole after rain on Inner Ring Road.")
                .severity(IncidentSeverity.MEDIUM)
                .reportedBy(user)
                .status(IncidentStatus.REPORTED)
                .build());

        incidentRepository.save(Incident.builder()
                .type(IncidentType.CONSTRUCTION)
                .latitude(16.3130).longitude(80.4440)
                .description("Pipeline work on Brodipet 4th Lane. One lane closed.")
                .severity(IncidentSeverity.HIGH)
                .reportedBy(user)
                .status(IncidentStatus.ACKNOWLEDGED)
                .build());

        incidentRepository.save(Incident.builder()
                .type(IncidentType.WATERLOGGING)
                .latitude(16.3160).longitude(80.4470)
                .description("Heavy waterlogging near Lakshmipuram underpass.")
                .severity(IncidentSeverity.HIGH)
                .reportedBy(user)
                .status(IncidentStatus.REPORTED)
                .build());

        log.info("  ✓ Road Hazards & Incidents (4)");
    }

    // ── Emergency Green Corridor (Phase 4) ────────────────────────────────────

    private void seedGreenCorridor(Hospital hospital) {
        greenCorridorRepository.save(GreenCorridor.builder()
                .corridorCode("GC-AMB-101")
                .name("Guntur Trauma Center Express Corridor")
                .ambulanceNumber("AMB-101")
                .destinationHospital(hospital)
                .status("STANDBY")
                .totalSignals(4)
                .signalsCleared(0)
                .build());

        signalEventRepository.save(SignalEvent.builder()
                .signalCode("SIGNAL-01")
                .ambulanceNumber("AMB-101")
                .eventType("PREEMPTION_TRIGGERED")
                .previousState("RED")
                .newState("FORCED_GREEN")
                .distanceMeters(220L)
                .message("Ambulance AMB-101 triggered 300m geofence at SIGNAL-01.")
                .build());

        log.info("  ✓ Emergency Green Corridor & Audit Events (Phase 4)");
    }

    // ── Waterlogging Zones (Phase 5) ──────────────────────────────────────────

    private void seedWaterloggingZones() {
        waterloggingZoneRepository.save(WaterloggingZone.builder()
                .zoneName("Lakshmipuram Railway Underpass")
                .latitude(16.3160).longitude(80.4470)
                .radiusMeters(300.0)
                .depthCm(45)
                .severity(IncidentSeverity.CRITICAL)
                .description("Severe flood accumulation under rail bridge. Low ground clearance vehicles stalled.")
                .active(true)
                .build());

        waterloggingZoneRepository.save(WaterloggingZone.builder()
                .zoneName("Brodipet 2nd Lane Low Drainage Point")
                .latitude(16.3110).longitude(80.4410)
                .radiusMeters(200.0)
                .depthCm(25)
                .severity(IncidentSeverity.MEDIUM)
                .description("Drainage overflow causing slow moving traffic.")
                .active(true)
                .build());

        log.info("  ✓ Waterlogging Flood Hazard Zones (2)");
    }

    // ── Active Emergency Cases for Hospital Queue (Phase 5) ───────────────────

    private void seedEmergencyCases(User user, Ambulance ambulance, Hospital hospital) {
        emergencyRequestRepository.save(EmergencyRequest.builder()
                .user(user)
                .ambulance(ambulance)
                .hospital(hospital)
                .patientName("K. Rajesh (Severe Trauma)")
                .description("Cardiovascular distress & road accident shock. Immediate ICU bed required.")
                .pickupLatitude(16.3050).pickupLongitude(80.4320)
                .severity(IncidentSeverity.CRITICAL)
                .status(EmergencyStatus.EN_ROUTE)
                .build());

        log.info("  ✓ Active Prioritized Emergency Case seeded for Hospital queue");
    }
}
