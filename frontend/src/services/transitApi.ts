/**
 * Transit & Geolocation API Service
 * Integrates:
 * 1. OpenStreetMap Overpass API for bus stops and bus terminals
 * 2. Nominatim for address geocoding and reverse geocoding
 * 3. OSRM (Open Source Routing Machine) for road-following polylines
 * 4. UrbanEye Backend APIs (/api/buses, /api/buses/{number}/details, etc.)
 */

export interface GeocodingResult {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: 'bus_station' | 'bus_stop' | 'station' | 'location';
  importance?: number;
}

// Fallback prominent transit stops around Guntur / Amaravati metropolitan area
const KNOWN_TRANSIT_STOPS: GeocodingResult[] = [
  { id: 'ts-1', name: 'NTR Central Bus Station (RTC Complex)', displayName: 'NTR Central Bus Station, Guntur, AP', lat: 16.3015, lon: 80.4320, type: 'bus_station' },
  { id: 'ts-2', name: 'Guntur Railway Junction Terminal', displayName: 'Railway Station Road, Sambasiva Pet, Guntur', lat: 16.2995, lon: 80.4438, type: 'station' },
  { id: 'ts-3', name: 'Brodipet Bus Stop', displayName: 'Brodipet 4th Line, Main Road, Guntur', lat: 16.3067, lon: 80.4365, type: 'bus_stop' },
  { id: 'ts-4', name: 'Ala Super Speciality Hospital Stop', displayName: 'Ala Hospital Terminal, Brodipet, Guntur', lat: 16.3125, lon: 80.4348, type: 'bus_stop' },
  { id: 'ts-5', name: 'Lakshmipuram 4-Roads Bus Stop', displayName: 'Lakshmipuram Ring Road, Guntur', lat: 16.3120, lon: 80.4420, type: 'bus_stop' },
  { id: 'ts-6', name: 'Amaravati Seed Capital Road Hub', displayName: 'AP Secretariat Express Stop, Velagapudi, Amaravati', lat: 16.3351, lon: 80.4812, type: 'bus_station' },
  { id: 'ts-7', name: 'Pattabhipuram Circle Bus Stop', displayName: 'Pattabhipuram Main Junction, Guntur', lat: 16.2974, lon: 80.4491, type: 'bus_stop' },
  { id: 'ts-8', name: 'Naaz Centre Bus Stop', displayName: 'Naaz Theatre Junction, Market Road, Guntur', lat: 16.3045, lon: 80.4345, type: 'bus_stop' },
  { id: 'ts-9', name: 'AIIMS Mangalagiri Transit Terminal', displayName: 'AIIMS Medical Campus, Mangalagiri Bypass', lat: 16.4300, lon: 80.5500, type: 'bus_station' },
  { id: 'ts-10', name: 'Kaza Toll Gate Bus Stop', displayName: 'NH-16 Kaza Toll Plaza, Vijayawada Highway', lat: 16.3250, lon: 80.4600, type: 'bus_stop' },
];

/**
 * Search bus stations and stops using Nominatim & Overpass API with local fallback
 */
export async function searchTransitLocations(query: string): Promise<GeocodingResult[]> {
  const clean = (query || '').trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  // Filter local known stops first for instant high-relevance matches
  const localMatches = KNOWN_TRANSIT_STOPS.filter(
    (s) => s.name.toLowerCase().includes(clean) || s.displayName.toLowerCase().includes(clean)
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Call Nominatim with transit prioritization
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ' bus stop'
    )}&addressdetails=1&limit=6`;

    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'UrbanEye-Transit-Navigator/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const remoteResults: GeocodingResult[] = data.map((item: any) => ({
          id: `osm-${item.osm_id || item.place_id}`,
          name: item.namedetails?.name || item.name || item.display_name.split(',')[0],
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: item.type === 'bus_stop' || item.class === 'highway' ? 'bus_stop' : 'bus_station',
          importance: item.importance,
        }));

        // Deduplicate with local matches
        const seen = new Set(localMatches.map((m) => m.name.toLowerCase()));
        const combined = [...localMatches];
        for (const item of remoteResults) {
          const key = item.name.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(item);
          }
        }
        return combined.slice(0, 8);
      }
    }
  } catch (err) {
    // Network or timeout failure - gracefully use local database
  }

  return localMatches;
}

/**
 * Reverse geocode GPS coordinates to nearest human-readable address & bus stop
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<GeocodingResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'UrbanEye-Transit-Navigator/1.0',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        id: `rev-${data.place_id || Date.now()}`,
        name: data.namedetails?.name || data.address?.road || data.address?.suburb || 'Current Location',
        displayName: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        lat,
        lon,
        type: 'location',
      };
    }
  } catch (e) {
    // Fallback
  }

  return {
    id: `gps-${Date.now()}`,
    name: 'Current GPS Position',
    displayName: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`,
    lat,
    lon,
    type: 'location',
  };
}

/**
 * Calculate accurate road-following polyline using OSRM
 */
export async function fetchOSRMRoute(
  startCoords: [number, number],
  endCoords: [number, number]
): Promise<{
  polyline: [number, number][];
  distanceKm: number;
  durationMins: number;
  waypoints: [number, number][];
}> {
  const [startLat, startLon] = startCoords;
  const [endLat, endLon] = endCoords;

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(osrmUrl);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // GeoJSON coords are [lon, lat], convert to Leaflet [lat, lon]
        const polyline: [number, number][] = route.geometry.coordinates.map(
          ([lon, lat]: [number, number]) => [lat, lon]
        );
        const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(route.duration / 60));

        return {
          polyline,
          distanceKm,
          durationMins,
          waypoints: [startCoords, endCoords],
        };
      }
    }
  } catch (err) {
    console.warn('OSRM router service error, falling back to direct trajectory:', err);
  }

  // Resilient straight line / intermediate interpolated fallback
  const polyline: [number, number][] = [
    startCoords,
    [(startLat + endLat) / 2 + 0.001, (startLon + endLon) / 2 - 0.001],
    endCoords,
  ];
  const dist = Math.hypot(endLat - startLat, endLon - startLon) * 111;
  return {
    polyline,
    distanceKm: parseFloat(dist.toFixed(1)),
    durationMins: Math.max(2, Math.round(dist * 2.5)),
    waypoints: [startCoords, endCoords],
  };
}

/**
 * Backend Bus Telemetry Endpoints
 */
export async function fetchBackendBuses() {
  try {
    const res = await fetch('/api/buses');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return null;
}

export async function fetchBackendBusDetails(busNumber: string, lat: number, lon: number) {
  try {
    const res = await fetch(`/api/buses/${encodeURIComponent(busNumber)}/details?latitude=${lat}&longitude=${lon}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return null;
}

export async function fetchBackendBusOccupancy(busNumber: string) {
  try {
    const res = await fetch(`/api/buses/${encodeURIComponent(busNumber)}/occupancy`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return null;
}

export async function fetchBackendRoutes() {
  try {
    const res = await fetch('/api/buses/routes');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline
  }
  return null;
}
