import React, { useEffect, useRef } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

/**
 * RoadRoute Component
 * Uses Leaflet Routing Machine with OSRM to snap route geometries naturally to roads.
 * Always renders a fallback glowing blue stroke safely without throwing or causing infinite re-renders.
 */
export const RoadRoute = ({
  waypoints = [],
  color = '#3B82F6',
  weight = 5,
  opacity = 0.95,
  fitBounds = false,
}) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    // Safety check for L and L.Routing
    if (typeof L === 'undefined' || !L.Routing || !L.Routing.control) {
      return;
    }

    try {
      const leafletWaypoints = waypoints.map((pt) => {
        if (Array.isArray(pt)) return L.latLng(pt[0], pt[1]);
        if (pt && typeof pt.lat === 'number' && typeof pt.lng === 'number') {
          return L.latLng(pt.lat, pt.lng);
        }
        return L.latLng(16.3067, 80.4365);
      });

      // Cleanup prior instance
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          // ignore
        }
        routingControlRef.current = null;
      }

      const routingControl = L.Routing.control({
        waypoints: leafletWaypoints,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          timeout: 8000,
        }),
        lineOptions: {
          styles: [
            { color: '#1E40AF', opacity: 0.5, weight: weight + 4, className: 'route-glow-blue' },
            { color: color, opacity: opacity, weight: weight }
          ],
          extendToWaypoints: false,
          missingRouteTolerance: 0
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: fitBounds,
        show: false,
        createMarker: () => null,
      });

      routingControl.on('routingerror', (e) => {
        // Graceful fallback to default polyline
      });

      routingControl.addTo(map);
      routingControlRef.current = routingControl;

      return () => {
        if (routingControlRef.current && map) {
          try {
            map.removeControl(routingControlRef.current);
          } catch (e) {
            // ignore
          }
          routingControlRef.current = null;
        }
      };
    } catch (err) {
      console.warn('RoadRoute initialization notice:', err);
    }
  }, [map, JSON.stringify(waypoints), color, weight, opacity, fitBounds]);

  // Always render base glowing stroke as rock-solid instant display
  const validPositions = (waypoints || []).filter(
    (pt) => Array.isArray(pt) || (pt && pt.lat && pt.lng)
  );

  if (validPositions.length < 2) return null;

  return (
    <>
      {/* Outer Glow Line */}
      <Polyline
        positions={validPositions}
        pathOptions={{
          color: '#1E40AF',
          weight: weight + 4,
          opacity: 0.4,
          className: 'route-glow-blue',
        }}
      />
      {/* Core Glowing Line */}
      <Polyline
        positions={validPositions}
        pathOptions={{
          color: color,
          weight: weight,
          opacity: opacity,
        }}
      />
    </>
  );
};

export default RoadRoute;
