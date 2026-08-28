import React from 'react';
import { motion } from 'framer-motion';
import {
  Navigation,
  Radio,
  CheckCircle2,
  Sparkles,
  Ambulance,
  Clock,
  Gauge
} from 'lucide-react';
import { useUrbanData } from '../../../../context/UrbanDataContext';
import GreenCorridorHUD from '../GreenCorridorHUD';

export const PoliceCorridorsView = () => {
  const { data } = useUrbanData();
  const ambulances = data?.ambulances || [];
  const activeAmbulance = ambulances.find(a => a.activePreemption) || ambulances[0] || {
    id: "AMB-108-GNT-01",
    vehicleNumber: "AP-07-TA-1081",
    destination: "Ala Super Speciality Hospital",
    distanceToNextSignal: "240 m",
    speedKmph: 46,
    eta: "3 mins",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              GREEN CORRIDOR COMMAND & CONTROL
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated signal synchronization prioritizing life-critical medical transports across Brodipet corridor.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Active Wave: Market Rd ⇄ Ala Hospital</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <GreenCorridorHUD ambulance={activeAmbulance} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Corridor Wave Performance</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Time Saved per Run:</span>
                <div className="text-lg font-black text-emerald-400 mt-1">4.8 mins</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Intersection Clearance:</span>
                <div className="text-lg font-black text-blue-400 mt-1">100% Green</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Sensors at Brodipet 4/1 and Station Road detect approaching EMS transmitters at 500m radius and force sequential green phases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceCorridorsView;
