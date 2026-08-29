# 🌐 UrbanEye AI — Smart Urban Mobility & Emergency Intelligence Platform

> **Guntur & Amaravati Capital Smart Grid Deployment**  
> An intelligent, multi-stakeholder urban operating system uniting **Citizens**, **Traffic Police Command**, and **Hospital Triage** into a single synchronized real-time network.

---

## 📌 Executive Summary

UrbanEye AI addresses critical urban mobility and emergency response bottlenecks in high-density smart cities. By integrating AI-driven traffic intelligence, automated emergency vehicle preemption (Green Corridors), real-time transit telemetry, and pre-arrival hospital triage, UrbanEye eliminates emergency transit delays and optimizes civic flow.

```
       [ Citizen SOS / Transit ]
                  │
                  ▼
   ┌──────────────────────────────┐
   │    UrbanEye AI Core Engine    │
   │  - Emergency Preemption     │
   │  - AI Traffic & Flood Model  │
   │  - Real-Time STOMP/WebSocket │
   └───────┬──────────────┬───────┘
           ▼              ▼
 [ Police Traffic HUD ]  [ Hospital Bed & Triage ]
```

---

## ✨ Key Capabilities & Accomplishments

### 1. 🚨 Automated Green Corridor & Emergency Preemption
- **Dynamic Signal Clearance:** Police command can activate green wave corridors along emergency routes, overriding traffic signals in real time to grant ambulances seamless transit.
- **Conflict Detection:** AI checks for intersecting emergency paths and road blockages.
- **Audit Logging:** Every signal phase change and preemption event is recorded for compliance and post-incident analysis.

### 2. 🏥 Hospital Pre-Arrival Triage & Bed Management
- **Live Inbound ETA:** Real-time tracking of arriving ambulances with live telemetry.
- **Dynamic Bed Matrix:** Live inventory tracking for ICU, Ventilator, Emergency, and General ward beds.
- **Blood Bank Monitoring:** Real-time unit availability across blood groups ($A+$, $B+$, $O+$, $AB+$, etc.).
- **Pre-Arrival Case Intake:** Paramedics stream vitals, trauma severity, and injury notes so ER teams are pre-briefed before patient arrival.

### 3. 🚦 Police Tactical Command Center
- **Live Traffic Heatmap:** Segment-by-segment speed, congestion score, and road health monitoring across Guntur/Amaravati.
- **Signal Control Matrix:** Manual or automated adjustment of traffic signal cycle timers.
- **Incident Dispatch & Hazard Verification:** Direct triage and team dispatch for citizen-reported accidents, road closures, and waterlogging.
- **Simulated CCTV Feeds:** Visual verification points integrated across critical junctions.

### 4. 📱 Citizen Smart Mobility Portal
- **Multimodal Journey Planner:** Traffic-aware routing with real-time delays, alternative modes, and flood risk evasion.
- **Live Transit Tracking:** Route 21A, 14B, 7C, 33D buses with real-time coordinates, next-stop ETAs, and occupancy indicators.
- **One-Tap Emergency SOS:** Instant dispatch request locating the nearest available ambulance and notifying nearby hospital ERs.
- **Crowdsourced Hazard Reporting:** Community reporting for potholes, accidents, and waterlogged roads.
- **Voice AI Assistant:** Natural language query answering for transit schedules and route advice.

### 5. 🧠 AI & Analytical Intelligence Layer
- **Traffic Congestion Prediction:** Multi-factor prediction incorporating live speeds, historical trends, weather, and incident proximity.
- **Flood & Waterlogging Risk Analysis:** Elevation, live rainfall, and drainage capacity modeling to predict road submergence.
- **AI Hospital Recommendation:** Multi-criteria decision engine matching patient severity with nearest hospital bed availability and travel time.
- **Smart Bus ETA Engine:** Dynamic arrival time predictions accounting for corridor congestion.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
|---|---|
| **Backend Framework** | Java 21, Spring Boot 3.2.x, Spring MVC, Spring Data JPA |
| **Security & Auth** | Spring Security 6, JWT (JSON Web Tokens), Role-Based Access Control |
| **Real-Time Communication** | Spring WebSocket, STOMP Messaging Protocol |
| **Database & Persistence** | PostgreSQL (Production) / Hibernate ORM |
| **Frontend Framework** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Mapping & GIS** | Leaflet.js, React-Leaflet, OpenStreetMap Tile Provider |
| **State & API Client** | Axios, React Context API (`AuthContext`, `CityDataContext`) |
| **Icons & UI Elements** | Lucide React, Custom SVG Signal Indicators |
| **DevOps & Containers** | Docker, Docker Compose, Multi-stage builds |

---

## 📂 Architecture & Directory Structure

```
urbaneye-backend/
├── src/main/java/com/urbaneye/
│   ├── controller/               # REST API endpoints (15 controllers)
│   │   ├── AmbulanceController.java
│   │   ├── AuthController.java
│   │   ├── BusController.java
│   │   ├── EmergencyRequestController.java
│   │   ├── HospitalController.java
│   │   ├── IncidentController.java
│   │   ├── PoliceController.java
│   │   ├── RouteRecommendationController.java
│   │   ├── SignalController.java
│   │   ├── TrafficController.java
│   │   ├── UrbanIntelligenceController.java
│   │   ├── VoiceAssistantController.java
│   │   ├── WaterloggingController.java
│   │   └── WeatherController.java
│   ├── service/                  # Business & Core Services
│   │   ├── ai/                   # AI Intelligence & Decision Modules
│   │   │   ├── BusEtaPredictionService.java
│   │   │   ├── EmergencyDecisionService.java
│   │   │   ├── FloodRiskService.java
│   │   │   ├── HospitalRecommendationService.java
│   │   │   ├── TrafficPredictionService.java
│   │   │   └── UrbanIntelligenceService.java
│   │   ├── AmbulanceService.java
│   │   ├── AuthService.java
│   │   ├── BusService.java
│   │   ├── EmergencyRequestService.java
│   │   ├── GreenCorridorService.java
│   │   ├── HospitalService.java
│   │   └── IncidentService.java
│   ├── entity/                   # JPA Domain Entities
│   │   ├── Ambulance.java, Hospital.java, Bus.java, BusRoute.java
│   │   ├── TrafficSignal.java, RoadSegment.java, Incident.java
│   │   └── GreenCorridor.java, WaterloggingZone.java, User.java
│   ├── repository/               # Spring Data Repositories
│   ├── security/                 # JWT Auth Filters, Custom UserDetails
│   ├── config/                   # CORS, SecurityConfig, WebSocketConfig
│   └── DataInitializer.java     # Automated DB seeder with Guntur/Amaravati smart grid
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Role-based login (Citizen, Police, Hospital)
│   │   │   ├── dashboards/
│   │   │   │   ├── citizen/      # Citizen Map, Transit, SOS, Journey Planner
│   │   │   │   ├── police/       # Tactical Map, Signal Grid, Corridor HUD, CCTV
│   │   │   │   └── hospital/     # Inbound ETA, Bed Matrix, Blood Bank, Triage
│   │   │   └── shared/           # Leaflet Map Markers, TopNav, Weather Widget
│   │   ├── context/              # Auth & CityData global state
│   │   └── services/             # Axios API integration layer
├── docker-compose.yml
├── Dockerfile
└── pom.xml
```

---

## 🚦 Pre-configured Demo Accounts

All demo accounts are pre-seeded with password: `password123`

| Portal Role | Demo Email | Access Scope |
|---|---|---|
| 👤 **Citizen** | `user@urbaneye.com` | SOS dispatch, transit bus tracker, journey planner, incident reporting |
| 👮 **Police Command** | `police@urbaneye.com` | Green corridor control, traffic signal tuning, CCTV feeds, incident dispatch |
| 🏥 **Hospital ER** | `hospital@urbaneye.com` | Inbound ambulance triage, live bed inventory, blood bank management |

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Java 21 JDK** or higher
- **Node.js 18+** & npm
- **PostgreSQL 15+** (or Docker)

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/Sudheerreddy19/urbaneye-ai.git
cd urbaneye-backend

# Configure environment variables
cp .env.example .env

# Run Spring Boot Application
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080` (Auto-seeds initial smart city grid data).*

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### 3. Docker Deployment (Full Stack)

```bash
docker-compose up --build
```

---

## 📡 Key REST API Summary

### Authentication & Users
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Authenticate and retrieve JWT token with role
- `POST /api/auth/google` — Google OAuth token authentication

### Emergency & Green Corridor
- `POST /api/emergency/request` — Trigger emergency SOS & ambulance dispatch
- `GET /api/emergency/active` — List ongoing emergency dispatches
- `POST /api/corridor/activate/{id}` — Police command preemption activation
- `GET /api/corridor/status/{id}` — Green wave signal status along corridor

### Hospital & Triage
- `GET /api/hospitals/{id}/capacity` — Live bed counts & blood units
- `POST /api/hospitals/{id}/beds/update` — Update ICU/Emergency bed status
- `GET /api/hospitals/incoming` — Arriving ambulance triage feed

### Traffic & Public Transit
- `GET /api/traffic/segments` — Live road speed, congestion & health status
- `GET /api/signals` — Real-time state of all 10 traffic junctions
- `GET /api/buses/live` — Real-time telemetry & occupancy for all active transit buses
- `POST /api/route/recommend` — AI-powered multimodal route recommendation

### AI Intelligence
- `GET /api/intelligence/city-overview` — Real-time smart city health index & insights
- `POST /api/intelligence/predict-traffic` — Predictive congestion modeling
- `POST /api/intelligence/flood-risk` — Waterlogging prediction based on weather inputs
- `POST /api/voice/query` — Natural language city assistant query processing
