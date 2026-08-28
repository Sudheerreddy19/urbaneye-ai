import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Ambulance,
  Radio,
  TriangleAlert,
  Clock,
  TrafficCone,
  Shield,
  ShieldAlert,
  Activity,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useUrbanData } from '../../../context/UrbanDataContext';
import PoliceSidebar from './PoliceSidebar';
import TopNav from '../../shared/TopNav';
import TacticalMap from './TacticalMap';
import GreenCorridorHUD from './GreenCorridorHUD';
import IncidentTable from './IncidentTable';
import IncidentHeatmap from './IncidentHeatmap';
import CameraFeeds from './CameraFeeds';

// Sub-Views for Police Dashboard Navigation
import PoliceAmbulancesView from './views/PoliceAmbulancesView';
import PoliceSignalsView from './views/PoliceSignalsView';
import PoliceIncidentsView from './views/PoliceIncidentsView';
import PoliceCorridorsView from './views/PoliceCorridorsView';
import PoliceCCTVView from './views/PoliceCCTVView';
import PoliceReportsView from './views/PoliceReportsView';
import PoliceAlertsView from './views/PoliceAlertsView';
import PoliceAnalyticsView from './views/PoliceAnalyticsView';
import PoliceSettingsView from './views/PoliceSettingsView';

export const PoliceDashboard = ({ onLogout }) => {
  const { data } = useUrbanData();
  const [currentView, setCurrentView] = useState('Live Overview');

  const buses = data?.buses || [];
  const ambulances = data?.ambulances || [];
  const trafficSignals = data?.trafficSignals || [];
  const incidents = data?.incidents || [];

  // Top KPI Metrics (5 Cards)
  const kpiCards = [
    {
      id: 'kpi-buses',
      title: 'Active Buses',
      value: 24,
      subtext: 'Live on Capital Corridor',
      icon: Bus,
      accentColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      trend: '100% Tracking',
      trendColor: 'text-blue-400',
    },
    {
      id: 'kpi-ambulances',
      title: 'Ambulances',
      value: 8,
      subtext: '3 Active Green Corridors',
      icon: Ambulance,
      accentColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      trend: 'CODE RED Live',
      trendColor: 'text-rose-400 animate-pulse',
    },
    {
      id: 'kpi-signals',
      title: 'Traffic Signals',
      value: 32,
      subtext: 'All operational & AI-synced',
      icon: Radio,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      trend: '94% Opt. Score',
      trendColor: 'text-emerald-400',
    },
    {
      id: 'kpi-incidents',
      title: 'Incidents',
      value: 7,
      subtext: '3 Dispatched, 4 Monitored',
      icon: TriangleAlert,
      accentColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      trend: '2 Critical Areas',
      trendColor: 'text-amber-400',
    },
    {
      id: 'kpi-response',
      title: 'Avg. Response Time',
      value: '6.2 min',
      subtext: 'Across Guntur division today',
      icon: Clock,
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      trend: '-1.4 min faster',
      trendColor: 'text-emerald-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // View key normalization
  const activeKey = (currentView || 'Live Overview').toString().toLowerCase();

  const renderActiveView = () => {
    switch (activeKey) {
      case 'ambulances':
        return <PoliceAmbulancesView />;

      case 'traffic signals':
      case 'signals':
        return <PoliceSignalsView />;

      case 'incidents':
        return <PoliceIncidentsView />;

      case 'green corridors':
      case 'corridors':
        return <PoliceCorridorsView />;

      case 'cctv feeds':
      case 'cctv':
        return <PoliceCCTVView />;

      case 'reports':
      case 'reports & analytics':
        return <PoliceReportsView />;

      case 'alerts':
        return <PoliceAlertsView />;

      case 'analytics':
        return <PoliceAnalyticsView />;

      case 'settings':
        return <PoliceSettingsView />;

      case 'live overview':
      case 'dashboard':
      default:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* ========================================================================= */}
            {/* A. TOP KPI BAR (5 Cards) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {kpiCards.map((kpi) => {
                const IconComponent = kpi.icon;

                return (
                  <div
                    key={kpi.id}
                    className="group relative p-4 sm:p-4.5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Subtle Emerald Ambient Glow */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-400 block tracking-tight truncate">
                          {kpi.title}
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1 tracking-tight">
                          {kpi.value}
                        </div>
                      </div>

                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-inner flex-shrink-0 ${kpi.bgColor} ${kpi.accentColor}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 truncate">{kpi.subtext}</span>
                      <span className={`font-mono font-bold whitespace-nowrap ml-1 ${kpi.trendColor}`}>
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* ========================================================================= */}
            {/* B. MIDDLE SECTION (Grid: 65% Tactical Map / 35% Green Corridor HUD) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
              {/* Tactical Map (65%) */}
              <div className="lg:col-span-8 flex">
                <TacticalMap
                  buses={buses}
                  ambulances={ambulances}
                  trafficSignals={trafficSignals}
                  selectedAmbulanceId="AMB-108-GNT-01"
                />
              </div>

              {/* Green Corridor HUD (35%) */}
              <div className="lg:col-span-4 flex">
                <GreenCorridorHUD
                  ambulance={{
                    id: "AMB-108-GNT-01",
                    vehicleNumber: "AP-07-TA-1081",
                    destination: "Ala Super Speciality Hospital",
                    distanceToNextSignal: "240 m",
                    speedKmph: 46,
                    eta: "3 mins",
                  }}
                />
              </div>
            </motion.div>

            {/* ========================================================================= */}
            {/* C. BOTTOM SECTION (Grid of 3 Widgets) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {/* Widget 1: Recent Incidents Log */}
              <div className="flex">
                <IncidentTable incidents={incidents} />
              </div>

              {/* Widget 2: Incident Heatmap */}
              <div className="flex">
                <IncidentHeatmap />
              </div>

              {/* Widget 3: Traffic Camera Feeds */}
              <div className="flex">
                <CameraFeeds />
              </div>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0F19] text-slate-100 flex flex-row selection:bg-emerald-600/30 selection:text-emerald-300">
      {/* 1. POLICE SIDEBAR */}
      <PoliceSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
      />

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* SHARED TOP NAVIGATION (POLICE ROLE) */}
        <TopNav
          role="police"
          title="POLICE CONTROL DASHBOARD"
          subtitle="Tactical Urban Grid & Traffic Preemption Node"
          officerName="Inspector S. Mahesh"
          location="Guntur Central Police HQ"
          alertCount={4}
          onOpenAlerts={() => setCurrentView('Alerts')}
        />

        {/* DASHBOARD SCROLLABLE CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 smart-city-grid overflow-y-auto h-[calc(100vh-65px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default PoliceDashboard;
