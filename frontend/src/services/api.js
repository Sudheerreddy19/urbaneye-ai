/**
 * UrbanEye AI — Central API Service
 * Supports direct Railway/Production backend via VITE_API_BASE_URL,
 * or defaults to Vite local proxy (/api → http://localhost:8080/api).
 */

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const BASE_URL = API_ROOT ? `${API_ROOT}/api` : '/api';


// ─── Token helpers ─────────────────────────────────────────────────────────

export const TOKEN_KEY = 'ue_auth_token';
export const USER_KEY  = 'ue_auth_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getSavedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Role mapping ───────────────────────────────────────────────────────────
// Frontend uses: 'citizen' | 'police' | 'hospital'
// Backend enum:  USER      | POLICE   | HOSPITAL

export function frontendRoleToBackend(role) {
  const map = { citizen: 'USER', police: 'POLICE', hospital: 'HOSPITAL' };
  return map[role] ?? 'USER';
}

export function backendRoleToFrontend(role) {
  const map = { USER: 'citizen', POLICE: 'police', HOSPITAL: 'hospital' };
  return map[role] ?? 'citizen';
}

// ─── Core fetch helper ──────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Try to parse JSON regardless of status
  let body = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    // Backend may return { message: "..." } or a plain string
    const message =
      (typeof body === 'object' && body !== null && (body.message || body.error)) ||
      (typeof body === 'string' && body) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body;
}

// ─── Auth API ───────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * Returns AuthResponse { token, userId, name, email, role, message }
 */
export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Register a new user.
 * frontendRole: 'citizen' | 'police' | 'hospital'
 * Returns AuthResponse
 */
export async function register({ name, email, phone, password, frontendRole }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      role: frontendRoleToBackend(frontendRole),
    }),
  });
}

/**
 * Google / SSO login — sends user info directly to backend which
 * creates or finds the user and returns a JWT.
 * frontendRole: 'citizen' | 'police' | 'hospital'
 */
export async function googleAuth({ email, name, frontendRole }) {
  return request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      email,
      name: name || email.split('@')[0],
      role: frontendRoleToBackend(frontendRole),
    }),
  });
}

// ─── User Profile API ────────────────────────────────────────────────────────

/**
 * Fetch the currently-authenticated user's full profile from the DB.
 * Requires a valid JWT stored in localStorage.
 * Returns: { id, name, email, phone, role, ... }
 */
export async function getMe() {
  return request('/users/me');
}

// ─── Telemetry & Smart City APIs ──────────────────────────────────────────

/**
 * Fetch all registered ambulances with driver and hospital relations.
 */
export async function getAmbulances() {
  return request('/ambulances');
}

/**
 * Fetch nearby ambulances from user coordinates.
 */
export async function getNearbyAmbulances(latitude = 16.3067, longitude = 80.4365) {
  return request(`/ambulances/nearby?latitude=${latitude}&longitude=${longitude}`);
}

/**
 * Fetch single ambulance rich details card with driver contact and ETA.
 */
export async function getAmbulanceDetails(ambulanceNumber, latitude = 16.3067, longitude = 80.4365) {
  return request(`/ambulances/${ambulanceNumber}/details?latitude=${latitude}&longitude=${longitude}`);
}

/**
 * Fetch all transit buses.
 */
export async function getBuses() {
  return request('/buses');
}

/**
 * Fetch bus details with next stop and live occupancy.
 */
export async function getBusDetails(busNumber, latitude = 16.3067, longitude = 80.4365) {
  return request(`/buses/${busNumber}/details?latitude=${latitude}&longitude=${longitude}`);
}

/**
 * Fetch all city incidents / road hazards.
 */
export async function getIncidents() {
  return request('/incidents');
}

/**
 * Report a new hazard incident.
 */
export async function reportIncidentApi(incidentDto) {
  return request('/incidents', {
    method: 'POST',
    body: JSON.stringify(incidentDto),
  });
}

/**
 * Fetch all traffic signals.
 */
export async function getSignals() {
  return request('/traffic/signals');
}

/**
 * Fetch all road traffic segments.
 */
export async function getRoadSegments() {
  return request('/traffic/segments');
}

/**
 * Fetch hospital details and bed capacity.
 */
export async function getHospitals() {
  return request('/hospital/details');
}

/**
 * Health check endpoint
 */
export async function checkHealth() {
  const root = API_ROOT || '';
  const res = await fetch(`${root}/api/health`);
  return res.json();
}


