import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance,
  Users,
  BedDouble,
  Activity,
  Heart,
  TrendingUp,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  AlertTriangle,
  Siren,
  Building2
} from 'lucide-react';
import { useUrbanData } from '../../../context/UrbanDataContext';
import HospitalSidebar from './HospitalSidebar';
import TopNav from '../../shared/TopNav';
import IncomingTable from './IncomingTable';
import HospitalMap from './HospitalMap';
import BedMatrix from './BedMatrix';
import AlertsFeed from './AlertsFeed';
import BloodBankWidget from './BloodBankWidget';

// Sub-Views for Hospital Dashboard Navigation
import HospitalAmbulancesView from './views/HospitalAmbulancesView';
import HospitalPatientsView from './views/HospitalPatientsView';
import HospitalBedsView from './views/HospitalBedsView';
import HospitalStaffView from './views/HospitalStaffView';
import HospitalAlertsView from './views/HospitalAlertsView';
import HospitalReportsView from './views/HospitalReportsView';
import HospitalSettingsView from './views/HospitalSettingsView';

export const HospitalDashboard = ({ onLogout }) => {
  const { data } = useUrbanData();
  const [currentView, setCurrentView] = useState('Dashboard');
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(
    data?.ambulances?.[0]?.id || 'AMB-108-GNT-01'
  );

  const ambulances = data?.ambulances || [];
  const hospitalStats = data?.hospitalStats || {};

  // Top KPI Metrics (4 Cards)
  const kpiCards = [
    {
      id: 'kpi-incoming',
      title: 'Incoming Ambulances',
      value: ambulances.length || 4,
      subtext: 'Next 30 mins corridor ETA',
      icon: Ambulance,
      accentColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      trend: '+2 in last 10m',
      trendColor: 'text-rose-400',
    },
    {
      id: 'kpi-admitted',
      title: 'Admitted Today',
      value: 26,
      subtext: 'Patients processed in triage',
      icon: Users,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      trend: '+14% vs yesterday',
      trendColor: 'text-emerald-400',
    },
    {
      id: 'kpi-beds',
      title: 'Available Beds',
      value: hospitalStats?.beds?.available || 54,
      subtext: 'Total across all 4 ward units',
      icon: BedDouble,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      trend: '8 ICU Beds Free',
      trendColor: 'text-emerald-400',
    },
    {
      id: 'kpi-critical',
      title: 'Critical Patients',
      value: 7,
      subtext: 'In ICU / Resuscitation Bay',
      icon: Activity,
      accentColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      trend: 'Active Telemetry',
      trendColor: 'text-rose-400 animate-pulse',
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

  // Normalize view key
  const activeKey = (currentView || 'Dashboard').toString().toLowerCase();

  const renderActiveView = () => {
    switch (activeKey) {
      case 'incoming ambulances':
      case 'ambulances':
        return <HospitalAmbulancesView />;

      case 'patients & triage':
      case 'patients':
      case 'triage':
        return <HospitalPatientsView />;

      case 'bed management':
      case 'beds':
        return <HospitalBedsView />;

      case 'medical staff':
      case 'staff':
        return <HospitalStaffView />;

      case 'alerts & dispatches':
      case 'alerts':
        return <HospitalAlertsView />;

      case 'reports & analytics':
      case 'reports':
      case 'analytics':
        return <HospitalReportsView />;

      case 'settings':
        return <HospitalSettingsView />;

      case 'dashboard':
      case 'overview':
      default:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* ========================================================================= */}
            {/* A. TOP KPI BAR (Grid of 4 Cards) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpiCards.map((kpi) => {
                const IconComponent = kpi.icon;

                return (
                  <div
                    key={kpi.id}
                    className="group relative p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 shadow-xl backdrop-blur-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Corner Ambient Glow */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block tracking-tight">
                          {kpi.title}
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 tracking-tight">
                          {kpi.value}
                        </div>
                      </div>

                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-inner ${kpi.bgColor} ${kpi.accentColor}`}
                      >
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
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
            {/* B. MIDDLE SECTION (Grid: 60% Table / 40% Map) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
              {/* Incoming Ambulances Table (60%) */}
              <div className="lg:col-span-7 flex">
                <IncomingTable
                  ambulances={ambulances}
                  selectedAmbulanceId={selectedAmbulanceId}
                  onSelectAmbulance={setSelectedAmbulanceId}
                />
              </div>

              {/* Live Hospital React-Leaflet Map (40%) */}
              <div className="lg:col-span-5 flex">
                <HospitalMap
                  hospitalCoords={[16.3125, 80.4348]}
                  hospitalName="Ala Super Speciality Hospital"
                  ambulances={ambulances}
                  selectedAmbulanceId={selectedAmbulanceId}
                  onSelectAmbulance={setSelectedAmbulanceId}
                />
              </div>
            </motion.div>

            {/* ========================================================================= */}
            {/* C. BOTTOM SECTION (Grid of 3 Cards) */}
            {/* ========================================================================= */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {/* Card 1: Bed Availability Matrix */}
              <div className="flex">
                <BedMatrix bedStats={hospitalStats?.beds} />
              </div>

              {/* Card 2: Alerts & Notifications */}
              <div className="flex">
                <AlertsFeed />
              </div>

              {/* Card 3: Blood Bank Status */}
              <div className="flex">
                <BloodBankWidget bloodStats={hospitalStats?.bloodBank} />
              </div>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#090b14] text-slate-100 flex flex-row selection:bg-purple-600/30 selection:text-purple-300">
      {/* 1. HOSPITAL SIDEBAR */}
      <HospitalSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={onLogout}
        hospitalName="Ala Super Speciality Hospital"
        facilityType="Level-1 Trauma & Emergency Node"
      />

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* SHARED TOP NAVIGATION */}
        <TopNav
          title="HOSPITAL DASHBOARD"
          subtitle="Emergency Triage & Inbound Logistics"
          hospitalName="Ala Super Speciality Hospital"
          location="Brodipet, Guntur"
          alertCount={2}
          onOpenAlerts={() => setCurrentView('Alerts & Dispatches')}
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

export default HospitalDashboard;
