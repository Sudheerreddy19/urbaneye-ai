import { useState, useEffect, useRef } from 'react';

/**
 * useSmoothVehicleLerp
 * High-precision Mathematical Linear Interpolation (Lerp) for vehicles traversing multi-point polyline paths.
 * 
 * @param {Array} initialVehicles - Array of vehicle objects containing `path`, `currentCoordinates`, and `speedKmph`
 * @param {boolean} isPaused - When true, vehicle animation freezes in place immediately
 * @param {number} intervalMs - Animation tick interval in ms (default: 50ms for 20fps butter-smooth interpolation)
 * @returns {Array} smoothVehicles - Array of vehicles with updated [lat, lng] coordinates
 */
export const useSmoothVehicleLerp = (initialVehicles = [], isPaused = false, intervalMs = 50) => {
  const [vehicles, setVehicles] = useState(initialVehicles);

  // Store persistent tracker per vehicle { [id]: { segmentIndex: number, progress: number, currentCoords: [lat, lng] } }
  const trackerRef = useRef({});

  // Sync / initialize tracker whenever vehicle list changes or mounts
  useEffect(() => {
    if (!initialVehicles || initialVehicles.length === 0) return;

    initialVehicles.forEach((v, idx) => {
      const path = v.path || [v.currentCoordinates];
      if (!trackerRef.current[v.id]) {
        // Stagger initial progress offset based on index or existing pathIndex so vehicles don't all cluster
        const initialSegmentIdx = (v.pathIndex !== undefined ? v.pathIndex : idx) % Math.max(1, path.length);
        const startPoint = path[initialSegmentIdx] || v.currentCoordinates || [16.3067, 80.4365];
        
        trackerRef.current[v.id] = {
          segmentIndex: initialSegmentIdx,
          progress: 0,
          currentCoords: [...startPoint],
        };
      }
    });
  }, [initialVehicles]);

  // Main 50ms Lerp Animation Loop
  useEffect(() => {
    if (!initialVehicles || initialVehicles.length === 0) return;

    const timer = setInterval(() => {
      if (isPaused) {
        // User is hovering over or clicking a vehicle -> freeze coordinates
        return;
      }

      let hasMoved = false;

      const updatedList = initialVehicles.map((vehicle, idx) => {
        const path = vehicle.path;
        if (!path || path.length < 2) {
          return vehicle;
        }

        let tracker = trackerRef.current[vehicle.id];
        if (!tracker) {
          const segIdx = (vehicle.pathIndex !== undefined ? vehicle.pathIndex : idx) % path.length;
          tracker = {
            segmentIndex: segIdx,
            progress: 0,
            currentCoords: path[segIdx] || vehicle.currentCoordinates,
          };
          trackerRef.current[vehicle.id] = tracker;
        }

        const p1 = path[tracker.segmentIndex];
        const nextIdx = (tracker.segmentIndex + 1) % path.length;
        const p2 = path[nextIdx];

        if (!p1 || !p2) return vehicle;

        const dLat = p2[0] - p1[0];
        const dLng = p2[1] - p1[1];
        const segmentDist = Math.sqrt(dLat * dLat + dLng * dLng);

        // Calibrated travel distance in degrees:
        // A vehicle moving at 35 km/h covers approx 0.00008-0.0001 deg every 50ms in Guntur coordinates
        const speed = vehicle.speedKmph || 35;
        const stepDist = (speed / 38) * 0.00009;

        const stepProgress = segmentDist > 0.000001 ? stepDist / segmentDist : 1;
        tracker.progress += stepProgress;

        // Move across segment boundaries cleanly
        while (tracker.progress >= 1.0 && segmentDist > 0.000001) {
          tracker.progress -= 1.0;
          tracker.segmentIndex = (tracker.segmentIndex + 1) % path.length;
        }

        const activeP1 = path[tracker.segmentIndex];
        const activeP2 = path[(tracker.segmentIndex + 1) % path.length];
        const segDLat = activeP2[0] - activeP1[0];
        const segDLng = activeP2[1] - activeP1[1];

        // Linear Interpolation (Lerp) formula: P = P1 + (P2 - P1) * progress
        const interpLat = activeP1[0] + segDLat * tracker.progress;
        const interpLng = activeP1[1] + segDLng * tracker.progress;

        tracker.currentCoords = [interpLat, interpLng];
        hasMoved = true;

        return {
          ...vehicle,
          currentCoordinates: [interpLat, interpLng],
        };
      });

      if (hasMoved) {
        setVehicles(updatedList);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [initialVehicles, isPaused, intervalMs]);

  return vehicles;
};

export default useSmoothVehicleLerp;
