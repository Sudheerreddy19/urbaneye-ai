# UrbanEye AI — Smart Urban Mobility & Emergency Platform

> **Hackathon Project** — Guntur / Amaravati Capital Smart Grid Deployment  
> Real-time traffic management, automated green corridor signals, public transit tracking, and synchronized emergency response.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Java 21, Spring Security, JWT |
| Database | PostgreSQL |
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Maps | Leaflet.js |
| Auth | JWT (role-based: USER / POLICE / HOSPITAL) |
| Deployment | Docker, Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 15+

### 1. Backend

```bash
# Copy env and set your values
cp .env.example .env

# Run with Maven
./mvnw spring-boot:run
# Backend starts on http://localhost:8080
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

### 3. Docker (full stack)

```bash
docker-compose up --build
```

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Citizen | user@urbaneye.com | password123 |
| 👮 Police | police@urbaneye.com | password123 |
| 🏥 Hospital | hospital@urbaneye.com | password123 |

---

## 📁 Project Structure

```
urbaneye-backend/
├── src/                        # Spring Boot backend
│   └── main/java/com/urbaneye/
│       ├── controller/         # REST controllers
│       ├── service/            # Business logic
│       ├── entity/             # JPA entities
│       ├── repository/         # Spring Data repositories
│       ├── security/           # JWT filter + config
│       └── config/             # CORS, Security config
├── frontend/                   # React + Vite frontend
│   └── src/
│       ├── pages/              # Route pages (Login, Dashboards)
│       ├── components/         # Shared UI components
│       ├── context/            # AuthContext, CityDataContext
│       └── services/           # API service (axios)
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 🔐 API Endpoints (Auth)

```
POST /api/auth/register   — Register new user
POST /api/auth/login      — Login, returns JWT + role
```

After login, include `Authorization: Bearer <token>` in all requests.

---

## 🌆 Features

- **Citizen Portal** — Live bus tracking, route planning, hazard reporting, one-tap SOS
- **Police Command** — Signal synchronization, incident dispatch, green corridor control
- **Hospital Triage** — Inbound ETA tracking, bed matrix, blood bank status, pre-arrival triage
- **Unified Demo View** — Synchronized 3-way dashboard for presentations
