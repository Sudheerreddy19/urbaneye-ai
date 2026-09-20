import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTransitStore, type LiveBus } from '../store/transitStore';
import { fetchBackendBuses, fetchBackendBusDetails, fetchBackendBusOccupancy } from '../services/transitApi';
import { mockUrbanData } from '../data/mockUrbanData';

// Calculate bearing angle (0-360 deg) between previous and current coordinates
export function calculateBearing(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): number {
  if (startLat === destLat && startLng === destLng) return 0;
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

// Calculate distance in kilometers using the Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Map occupancy percentage to crowd classification
export function getOccupancyLevel(percentage: number): 'LOW' | 'MODERATE' | 'FULL' | 'CROWDED' {
  if (percentage >= 90) return 'FULL';
  if (percentage >= 70) return 'CROWDED';
  if (percentage >= 40) return 'MODERATE';
  return 'LOW';
}

export function useBusTracking(activeRouteFilter?: string | null) {
  const { buses, setBuses, selectedBus, setSelectedBus, updateBusTelemetry } = useTransitStore();
  const [telemetryMode, setTelemetryMode] = useState<'LIVE_BACKEND' | 'SIMULATED_STREAM'>('LIVE_BACKEND');
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date());
  const simulationIndicesRef = useRef<Record<string, number>>({});

  // 1. TanStack Query for polling real backend buses every 4 seconds
  const {
    data: backendBuses,
    isError: isBackendError,
    refetch,
  } = useQuery({
    queryKey: ['live-buses-telemetry'],
    queryFn: fetchBackendBuses,
    refetchInterval: 4000,
    staleTime: 3000,
  });

  // 2. Fallback base fleet when backend is initialising or offline
  const fallbackFleet: LiveBus[] = (mockUrbanData?.buses || []).map((b: any, idx: number) => ({
    id: b.id || b.busNumber || `BUS-${idx}`,
    busNumber: b.busNumber || `AP-07-Z-${2100 + idx}`,
    registrationNumber: b.registrationNumber || b.busNumber || `AP07-TG-210${idx + 1}`,
    routeNumber: b.routeNumber || '21A',
    routeName: b.routeName || 'Guntur Corridor Transit',
    driverName: b.driverName || 'Driver ' + (idx + 1),
    driverPhone: b.driverPhone || '+91 98480 ' + (11220 + idx),
    currentCoordinates: b.currentCoordinates || [16.3067, 80.4365],
    previousCoordinates: b.path?.[0] || b.currentCoordinates || [16.3067, 80.4365],
    speedKmph: b.speedKmph || 32,
    heading: 45,
    seatOccupancy: b.seatOccupancy || 65,
    totalSeats: b.totalSeats || 50,
    availableSeats: b.availableSeats || 18,
    occupancyLevel: getOccupancyLevel(b.seatOccupancy || 65),
    status: b.status || 'Active',
    nextStop: b.nextStop || 'Brodipet Main Road',
    distanceKm: b.distanceKm || 1.2,
    etaMinutes: b.etaMinutes || 4,
    eta: b.eta || '4 mins',
    acStatus: b.acStatus || 'AC Superfast Express',
    busType: (b.acStatus?.includes('AC') ? 'AC Electric Express' : 'Superfast Metro') as any,
    path: b.path || [],
    lastTelemetryUpdate: Date.now(),
  }));

  // Initial populate into Zustand
  useEffect(() => {
    if (buses.length === 0) {
      setBuses(fallbackFleet);
    }
  }, [buses.length, setBuses]);

  // Sync with Backend buses if available
  useEffect(() => {
    if (backendBuses && Array.isArray(backendBuses) && backendBuses.length > 0) {
      setTelemetryMode('LIVE_BACKEND');
      setBuses((currentBuses) => {
        const busMap = new Map(currentBuses.map((b) => [b.routeNumber || b.busNumber, b]));

        return backendBuses.map((dbBus: any, idx: number) => {
          const routeKey = dbBus.busRoute?.routeNumber || dbBus.busNumber || dbBus.route;
          const fallback = fallbackFleet.find((f) => f.routeNumber === routeKey || f.busNumber === dbBus.busNumber) || fallbackFleet[idx % fallbackFleet.length];
          const existing = busMap.get(routeKey) || busMap.get(dbBus.busNumber) || busMap.get(dbBus.id) || fallback;
          const newCoords: [number, number] = [
            dbBus.latitude || existing.currentCoordinates[0],
            dbBus.longitude || existing.currentCoordinates[1],
          ];
          const prevCoords = existing.currentCoordinates;
          const calculatedHeading = calculateBearing(
            prevCoords[0],
            prevCoords[1],
            newCoords[0],
            newCoords[1]
          ) || existing.heading;

          const occupancyPct =
            dbBus.capacity && dbBus.capacity > 0
              ? Math.round(((dbBus.passengers || 0) / dbBus.capacity) * 100)
              : existing.seatOccupancy;

          return {
            ...existing,
            id: dbBus.busNumber || `BUS-${dbBus.id}`,
            busNumber: dbBus.busNumber || existing.busNumber,
            registrationNumber: dbBus.registrationNumber || existing.registrationNumber,
            routeNumber: dbBus.busRoute?.routeNumber || dbBus.route || existing.routeNumber,
            routeName: dbBus.busRoute?.routeName || dbBus.route || existing.routeName,
            driverName: existing.driverName,
            driverPhone: existing.driverPhone,
            previousCoordinates: prevCoords,
            currentCoordinates: newCoords,
            heading: calculatedHeading,
            speedKmph: Math.round(dbBus.speed || existing.speedKmph || 30),
            seatOccupancy: occupancyPct,
            totalSeats: dbBus.capacity || existing.totalSeats || 50,
            availableSeats: Math.max(0, (dbBus.capacity || 50) - (dbBus.passengers || 0)),
            occupancyLevel: getOccupancyLevel(occupancyPct),
            nextStop: dbBus.nextStop?.stopName || existing.nextStop,
            lastTelemetryUpdate: Date.now(),
          };
        });
      });
      setLastHeartbeat(new Date());
    } else if (isBackendError) {
      setTelemetryMode('SIMULATED_STREAM');
    }
  }, [backendBuses, isBackendError, setBuses]);

  // High-frequency telemetry animation stream: smooth progress along road paths
  useEffect(() => {
    const streamInterval = setInterval(() => {
      setBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          const path = bus.path && bus.path.length > 1 ? bus.path : fallbackFleet.find((f) => f.id === bus.id)?.path;
          if (!path || path.length < 2) return bus;

          const currentIdx = simulationIndicesRef.current[bus.id] ?? 0;
          const nextIdx = (currentIdx + 1) % path.length;
          simulationIndicesRef.current[bus.id] = nextIdx;

          const prevCoords = bus.currentCoordinates;
          const nextCoords = path[nextIdx];
          const newHeading = calculateBearing(prevCoords[0], prevCoords[1], nextCoords[0], nextCoords[1]);
          const microSpeed = Math.round(24 + Math.sin(Date.now() / 3000 + nextIdx) * 12);

          // Update distance & ETA dynamically
          const remainingDist = parseFloat((0.4 + (path.length - nextIdx) * 0.35).toFixed(1));
          const etaMins = Math.max(1, Math.round((remainingDist / (microSpeed || 25)) * 60));

          return {
            ...bus,
            previousCoordinates: prevCoords,
            currentCoordinates: nextCoords,
            heading: newHeading,
            speedKmph: microSpeed,
            distanceKm: remainingDist,
            etaMinutes: etaMins,
            eta: `${etaMins} mins`,
            lastTelemetryUpdate: Date.now(),
          };
        });
      });
      setLastHeartbeat(new Date());
    }, 3000);

    return () => clearInterval(streamInterval);
  }, [setBuses]);

  // Handler to inspect real-time bus details and occupancy on click
  const inspectBus = useCallback(
    async (bus: LiveBus) => {
      setSelectedBus(bus);

      // Fetch fresh live details from backend if possible
      try {
        const [lat, lon] = bus.currentCoordinates;
        const details = await fetchBackendBusDetails(bus.busNumber, lat, lon);
        if (details) {
          updateBusTelemetry(bus.busNumber, {
            seatOccupancy: Math.round(details.occupancyPercentage || bus.seatOccupancy),
            occupancyLevel: (details.occupancyLevel || getOccupancyLevel(bus.seatOccupancy)) as any,
            nextStop: details.nextStopName || bus.nextStop,
            distanceKm: details.distanceKm || bus.distanceKm,
            etaMinutes: details.etaMinutes || bus.etaMinutes,
            eta: details.etaMinutes ? `${details.etaMinutes} mins` : bus.eta,
          });
        }
      } catch (err) {
        // Keep existing client telemetry
      }
    },
    [setSelectedBus, updateBusTelemetry]
  );

  const filteredBuses = activeRouteFilter
    ? buses.filter(
        (b) =>
          b.routeNumber.toLowerCase() === activeRouteFilter.toLowerCase() ||
          b.routeName.toLowerCase().includes(activeRouteFilter.toLowerCase())
      )
    : buses;

  return {
    buses: filteredBuses,
    selectedBus,
    inspectBus,
    telemetryMode,
    lastHeartbeat,
    refetchTelemetry: refetch,
  };
}
