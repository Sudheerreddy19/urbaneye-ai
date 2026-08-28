import React, { createContext, useContext, useState, useEffect } from 'react';
// TODO Phase 2: Replace mockUrbanData with live API calls to the backend
// Endpoints: GET /api/buses, /api/ambulances, /api/incidents, /api/traffic, /api/signals (+ WebSocket)
import { mockUrbanData } from '../data/mockUrbanData';


import {
  getAmbulances,
  getBuses,
  getIncidents,
  getSignals,
  getRoadSegments,
  getHospitals,
} from '../services/api';

const UrbanDataContext = createContext(null);

export const UrbanDataProvider = ({ children }) => {
  const [data, setData] = useState(mockUrbanData);
  const [activeRole, setActiveRole] = useState(null);
  const [liveTimestamp, setLiveTimestamp] = useState(new Date());

  // Attempt initial fetch from backend APIs to populate real DB records
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [ambRes, busRes, incRes, sigRes, segRes, hospRes] = await Promise.allSettled([
          getAmbulances(),
          getBuses(),
          getIncidents(),
          getSignals(),
          getRoadSegments(),
          getHospitals(),
        ]);

        if (!isMounted) return;

        setData((prev) => {
          let updated = { ...prev };

          // Merge backend ambulances if fetched
          if (ambRes.status === 'fulfilled' && Array.isArray(ambRes.value) && ambRes.value.length > 0) {
            const mappedAmbulances = ambRes.value.map((dbAmb, idx) => {
              const fallback = prev.ambulances?.[idx] || prev.ambulances?.[0] || {};
              return {
                ...fallback,
                id: dbAmb.ambulanceNumber || `AMB-${dbAmb.id}`,
                vehicleNumber: dbAmb.ambulanceNumber || fallback.vehicleNumber,
                driverName: dbAmb.driver?.name || fallback.driverName || 'Ramesh Kumar',
                driverPhone: dbAmb.driver?.phone || fallback.driverPhone || '+91 98765 43220',
                licenseNumber: dbAmb.driver?.licenseNumber || fallback.licenseNumber || 'AP07D1001',
                driverRating: dbAmb.driver?.rating || fallback.driverRating || 4.8,
                hospitalName: dbAmb.hospital?.name || fallback.hospitalName || 'Guntur Government Hospital',
                hospitalAddress: dbAmb.hospital?.address || fallback.hospitalAddress,
                hospitalPhone: dbAmb.hospital?.phone || fallback.hospitalPhone,
                triage: dbAmb.ambulanceType || fallback.triage || 'ALS',
                condition: dbAmb.status === 'BUSY' ? 'Critical' : 'Available',
                currentCoordinates: (dbAmb.latitude && dbAmb.longitude) ? [dbAmb.latitude, dbAmb.longitude] : fallback.currentCoordinates,
                speedKmph: dbAmb.speed || fallback.speedKmph || 45,
              };
            });
            updated.ambulances = mappedAmbulances;
          }

          // Merge backend buses if fetched
          if (busRes.status === 'fulfilled' && Array.isArray(busRes.value) && busRes.value.length > 0) {
            const mappedBuses = busRes.value.map((dbBus, idx) => {
              const fallback = prev.buses?.[idx] || prev.buses?.[0] || {};
              return {
                ...fallback,
                id: dbBus.busNumber || `BUS-${dbBus.id}`,
                busNumber: dbBus.busNumber || fallback.busNumber,
                routeNumber: dbBus.route?.routeNumber || fallback.routeNumber,
                routeName: dbBus.route?.routeName || fallback.routeName,
                driverName: dbBus.driverName || fallback.driverName,
                driverPhone: dbBus.driverPhone || fallback.driverPhone,
                currentCoordinates: (dbBus.latitude && dbBus.longitude) ? [dbBus.latitude, dbBus.longitude] : fallback.currentCoordinates,
                speedKmph: dbBus.speed || fallback.speedKmph || 32,
              };
            });
            updated.buses = mappedBuses;
          }

          // Merge backend incidents if fetched
          if (incRes.status === 'fulfilled' && Array.isArray(incRes.value) && incRes.value.length > 0) {
            const mappedIncidents = incRes.value.map((dbInc, idx) => ({
              id: `INC-${dbInc.id}`,
              title: dbInc.title,
              type: dbInc.type || 'Hazard',
              severity: dbInc.severity || 'Medium',
              location: dbInc.locationDescription || 'Guntur Corridor',
              coordinates: [dbInc.latitude || 16.3067, dbInc.longitude || 80.4365],
              reportedAt: dbInc.reportedAt ? new Date(dbInc.reportedAt).toLocaleTimeString() : 'Recent',
              status: dbInc.status || 'Active',
              impact: dbInc.description || 'Verified road alert',
            }));
            updated.incidents = mappedIncidents;
          }

          return updated;
        });
      } catch (err) {
        console.warn('Backend telemetry sync fallback to local store:', err);
      }
    };

    fetchBackendData();
    return () => { isMounted = false; };
  }, []);

  // Real-time ticking simulation: updates signal countdowns & telemetry timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        // Update Traffic Signals Countdown
        const updatedSignals = (prev.trafficSignals || []).map((signal) => {
          const nextCount = signal.countdown > 1 ? signal.countdown - 1 : 45;
          return {
            ...signal,
            countdown: nextCount,
          };
        });

        return {
          ...prev,
          trafficSignals: updatedSignals,
        };
      });
      setLiveTimestamp(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Utility actions for simulated smart city operations
  const toggleSignalPreemption = (signalId) => {
    setData((prev) => ({
      ...prev,
      trafficSignals: prev.trafficSignals.map((s) => {
        if (s.id === signalId) {
          const isForced = s.currentState === 'FORCED GREEN';
          return {
            ...s,
            currentState: isForced ? 'RED' : 'FORCED GREEN',
            greenCorridorLocked: !isForced,
          };
        }
        return s;
      }),
    }));
  };

  const updateAmbulanceStatus = (ambId, updates) => {
    setData((prev) => ({
      ...prev,
      ambulances: prev.ambulances.map((amb) =>
        amb.id === ambId ? { ...amb, ...updates } : amb
      ),
    }));
  };

  const toggleAmbulanceBooking = (ambId) => {
    setData((prev) => ({
      ...prev,
      ambulances: prev.ambulances.map((amb) => {
        if (amb.id === ambId) {
          const currentBooked = !amb.isBooked;
          return {
            ...amb,
            isBooked: currentBooked,
          };
        }
        return amb;
      }),
    }));
  };

  const addIncidentReport = (newIncident) => {
    setData((prev) => ({
      ...prev,
      incidents: [newIncident, ...(prev.incidents || [])],
    }));
  };

  const value = {
    data,
    activeRole,
    setActiveRole,
    liveTimestamp,
    toggleSignalPreemption,
    updateAmbulanceStatus,
    toggleAmbulanceBooking,
    addIncidentReport,
    reportIncident: addIncidentReport,
  };

  return (
    <UrbanDataContext.Provider value={value}>
      {children}
    </UrbanDataContext.Provider>
  );
};

export const useUrbanData = () => {
  const context = useContext(UrbanDataContext);
  if (!context) {
    throw new Error('useUrbanData must be used within an UrbanDataProvider');
  }
  return context;
};

export default UrbanDataContext;
