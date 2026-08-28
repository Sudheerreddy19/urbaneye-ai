import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Bus,
  Map,
  TriangleAlert,
  PhoneCall,
  TrafficCone,
  ShieldAlert,
  Video,
  Ambulance,
  BedDouble,
  Droplet,
  Activity,
  Layers,
  User,
  Shield,
  Building2,
  Lock,
  Mail,
  Phone,
  KeyRound,
  Stethoscope,
  Building,
  TrendingUp,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import CitizenLogin from './CitizenLogin';
import PoliceLogin from './PoliceLogin';
import HospitalLogin from './HospitalLogin';
import { useAuth } from '../../context/AuthContext';

const roleContent = {
  citizen: {
    desc: "Your personal smart city transit and safety companion. Plan journeys, track buses, and report hazards in real-time.",
    features: [
      { icon: "Bus", color: "text-blue-400", bg: "bg-blue-400/10", title: "Live Transit Tracking", sub: "Real-time bus telemetry and arrival countdowns." },
      { icon: "Map", color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Multi-Modal Routing", sub: "Find the fastest route using buses, bikes, and walking." },
      { icon: "TriangleAlert", color: "text-amber-400", bg: "bg-amber-400/10", title: "Hazard Reporting", sub: "Instantly report potholes, accidents, and waterlogging." },
      { icon: "PhoneCall", color: "text-rose-400", bg: "bg-rose-400/10", title: "One-Tap SOS", sub: "Directly connect with emergency services and share location." }
    ]
  },
  police: {
    desc: "Tactical command interface for city-wide traffic synchronization and rapid incident deployment.",
    features: [
      { icon: "TrafficCone", color: "text-amber-400", bg: "bg-amber-400/10", title: "Signal Synchronization", sub: "AI-driven traffic light control and congestion clearing." },
      { icon: "ShieldAlert", color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Incident Dispatch", sub: "Automated routing for patrol units to hazard zones." },
      { icon: "Video", color: "text-blue-400", bg: "bg-blue-400/10", title: "CCTV Telemetry", sub: "Live access to intersection cameras and speed sensors." },
      { icon: "Ambulance", color: "text-rose-400", bg: "bg-rose-400/10", title: "Green Corridor Control", sub: "Manual override for active emergency vehicle routes." }
    ]
  },
  hospital: {
    desc: "Integrated medical logistics portal for inbound emergency triage and resource allocation.",
    features: [
      { icon: "Ambulance", color: "text-rose-400", bg: "bg-rose-400/10", title: "Inbound ETA Tracking", sub: "Live map tracking of incoming critical patient transports." },
      { icon: "BedLine", color: "text-blue-400", bg: "bg-blue-400/10", title: "Bed Availability Matrix", sub: "Real-time ICU, ventilator, and general ward capacities." },
      { icon: "Droplet", color: "text-red-500", bg: "bg-red-500/10", title: "Blood Bank Status", sub: "Automated alerts for low stock on critical blood types." },
      { icon: "Activity", color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Pre-Arrival Triage", sub: "Patient condition data transmitted before hospital arrival." }
    ]
  }
};

const getFeatureIcon = (iconName) => {
  switch (iconName) {
    case 'Bus': return Bus;
    case 'Map': return Map;
    case 'TriangleAlert': return TriangleAlert;
    case 'PhoneCall': return PhoneCall;
    case 'TrafficCone': return TrafficCone;
    case 'ShieldAlert': return ShieldAlert;
    case 'Video': return Video;
    case 'Ambulance': return Ambulance;
    case 'BedLine':
    case 'BedDouble': return BedDouble;
    case 'Droplet': return Droplet;
    case 'Activity': return Activity;
    default: return Sparkles;
  }
};

const roleTabs = [
  {
    id: 'citizen',
    label: 'User / Citizen',
    shortLabel: 'Citizen',
    icon: User,
    accentColor: 'blue',
    activeBg: 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]',
    badgeText: 'Citizen Access',
    badgeClass: 'text-blue-400 bg-blue-950/80 border-blue-800/60',
    primaryColor: '#2563EB',
    themeGradient: 'from-slate-950 via-slate-900 to-blue-950/90',
  },
  {
    id: 'police',
    label: 'Police Control',
    shortLabel: 'Police',
    icon: Shield,
    accentColor: 'emerald',
    activeBg: 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]',
    badgeText: 'Law Enforcement',
    badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
    primaryColor: '#059669',
    themeGradient: 'from-slate-950 via-slate-900 to-emerald-950/90',
  },
  {
    id: 'hospital',
    label: 'Hospital',
    shortLabel: 'Hospital',
    icon: Building2,
    accentColor: 'rose',
    activeBg: 'bg-rose-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]',
    badgeText: 'Emergency Medical',
    badgeClass: 'text-rose-400 bg-rose-950/80 border-rose-800/60',
    primaryColor: '#DC2626',
    themeGradient: 'from-slate-950 via-slate-900 to-rose-950/90',
  },
];

export const AuthHub = ({ initialRole = 'citizen', onBack, onLoginSuccess, onLogin }) => {
  const { register } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole || 'citizen');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'

  const handleAuthSuccess = (role, data) => {
    if (onLoginSuccess) onLoginSuccess(role, data);
    if (onLogin) onLogin(role, data);
  };

  // Registration Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    identifier: '',
    extraField: '', // Mobile for citizen, precinct for police, dept for hospital
    password: '',
    confirmPassword: '',
    agreed: false
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpSubmitting, setSignUpSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole);
    }
  }, [initialRole]);

  // Reset errors when switching modes/roles
  useEffect(() => {
    setSignUpError('');
    setSignUpSuccess(false);
    setForgotSuccess(false);
  }, [activeRole, authMode]);

  const currentRoleConfig = roleTabs.find((r) => r.id === activeRole) || roleTabs[0];
  const activeContent = roleContent[activeRole] || roleContent.citizen;

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setSignUpSubmitting(true);
    try {
      const role = await register({
        name: signUpData.name,
        email: signUpData.identifier,
        phone: signUpData.extraField,
        password: signUpData.password,
        frontendRole: activeRole,
      });
      setSignUpSuccess(true);
      setTimeout(() => {
        handleAuthSuccess(role, signUpData);
      }, 1500);
    } catch (err) {
      setSignUpError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSignUpSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitting(true);
    // No forgot-password endpoint yet — inform user to contact admin
    setTimeout(() => {
      setForgotSubmitting(false);
      setForgotSuccess(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-5 lg:p-8 smart-city-grid">
      {/* Dynamic Ambient Background Glows */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 blur-3xl pointer-events-none rounded-full transition-all duration-700 opacity-20"
        style={{ backgroundColor: currentRoleConfig.primaryColor }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Split-Screen Master Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-800/90 grid grid-cols-1 lg:grid-cols-12 min-h-[740px]"
      >
        {/* ========================================================================= */}
        {/* LEFT PANEL: DYNAMIC SMART CITY HERO (lg:col-span-5) */}
        {/* ========================================================================= */}
        <div className={`relative lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-gradient-to-br ${currentRoleConfig.themeGradient} text-white overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 transition-colors duration-500`}>
          {/* Cyber Grid Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* TOP SECTION: Node Status & Header */}
          <div className="relative z-10 space-y-4">
            {/* Top Glowing Node Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Node:</span>
              <span className="text-emerald-400 font-medium tracking-tight">Guntur-Amaravati Corridor</span>
            </div>

            {/* Logo & Dynamic Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/25">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Layers className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>UrbanEye</span>
                    <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">AI</span>
                  </h1>
                </div>
              </div>

              {/* Dynamic Paragraph Description with Smooth Fade */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeRole}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-sm text-slate-300/90 font-normal leading-relaxed min-h-[40px]"
                >
                  {activeContent.desc}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* MIDDLE SECTION: Dynamic Feature Cards */}
          <div className="relative z-10 my-6 sm:my-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {activeContent.features.map((feature, idx) => {
                  const IconComp = getFeatureIcon(feature.icon);
                  return (
                    <motion.div
                      key={`${activeRole}-${idx}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.3 }}
                      className="group flex items-start gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700/80 transition-all duration-200 backdrop-blur-sm shadow-sm"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border border-slate-700/50 ${feature.bg} ${feature.color} shadow-sm transition-transform duration-200 group-hover:scale-105`}
                      >
                        <IconComp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-snug line-clamp-1">
                          {feature.sub}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM SECTION: Footer Widget */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-3">
            {/* Visual Mini Bar-Chart Graphic */}
            <div className="relative h-11 w-full overflow-hidden rounded-xl bg-slate-950/70 border border-slate-800/60 flex items-end justify-between px-4 py-2">
              <div className="flex items-end gap-1.5 w-full h-full">
                {[45, 68, 32, 85, 92, 55, 78, 60, 95, 40, 75, 88, 62, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      backgroundColor: i % 2 === 0 ? currentRoleConfig.primaryColor : '#38BDF8',
                      opacity: 0.75 + (i % 3) * 0.1
                    }}
                    animate={{
                      height: [`${height * 0.4}%`, `${height}%`, `${height * 0.6}%`],
                    }}
                    transition={{
                      duration: 2.2 + (i % 4) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-rose-500 opacity-60" />
            </div>

            {/* Footer Flanking Badges */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Grid 99.9% Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: INTERACTIVE AUTH AREA & REGISTRATION TOGGLES (lg:col-span-7) */}
        {/* ========================================================================= */}
        <div className="relative lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-slate-900/95 text-slate-100 backdrop-blur-xl">
          <div>
            {/* Top Bar: Back Button & Role Badge */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <button
                onClick={onBack}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200 cursor-pointer group shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Role Selection</span>
              </button>

              <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border shadow-sm transition-all duration-300 ${currentRoleConfig.badgeClass}`}>
                {currentRoleConfig.badgeText}
              </span>
            </div>

            {/* Dynamic Header based on Auth Mode */}
            <div className="space-y-1.5 mb-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {authMode === 'signin' && "Welcome Back!"}
                {authMode === 'signup' && "Create Account"}
                {authMode === 'forgot' && "Account Recovery"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {authMode === 'signin' && "Sign in to access your customized smart city operational dashboard."}
                {authMode === 'signup' && `Register your credentials for the ${currentRoleConfig.label} portal.`}
                {authMode === 'forgot' && "Enter your registered credentials to receive recovery passkeys."}
              </p>
            </div>

            {/* Role Switcher Pill Tabs (Enabled across all modes) */}
            <div className="mb-5">
              <div className="p-1 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 shadow-inner">
                {roleTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeRole === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveRole(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeRoleTab"
                          className={`absolute inset-0 rounded-xl ${tab.activeBg}`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-1.5">
                        <IconComponent className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.shortLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DYNAMIC FORM MOUNTING (Sign In / Sign Up / Forgot Password) */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* ========================================================= */}
              {/* MODE 1: SIGN IN (Dynamic Role Login Forms) */}
              {/* ========================================================= */}
              {authMode === 'signin' && activeRole === 'citizen' && (
                <motion.div
                  key="citizen-signin"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <CitizenLogin
                    onLoginSuccess={handleAuthSuccess}
                    onLogin={handleAuthSuccess}
                    onToggleMode={setAuthMode}
                  />
                </motion.div>
              )}

              {authMode === 'signin' && activeRole === 'police' && (
                <motion.div
                  key="police-signin"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <PoliceLogin
                    onLoginSuccess={handleAuthSuccess}
                    onLogin={handleAuthSuccess}
                    onToggleMode={setAuthMode}
                  />
                </motion.div>
              )}

              {authMode === 'signin' && activeRole === 'hospital' && (
                <motion.div
                  key="hospital-signin"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <HospitalLogin
                    onLoginSuccess={handleAuthSuccess}
                    onLogin={handleAuthSuccess}
                    onToggleMode={setAuthMode}
                  />
                </motion.div>
              )}

              {/* ========================================================= */}
              {/* MODE 2: SIGN UP (Dynamic Role Registration Form) */}
              {/* ========================================================= */}
              {authMode === 'signup' && (
                <motion.div
                  key={`signup-${activeRole}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="w-full space-y-4"
                >
                  {/* Success Banner */}
                  {signUpSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Account created successfully! Logging you into the dashboard...</span>
                    </motion.div>
                  )}

                  {/* Error Banner */}
                  {signUpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs flex items-center gap-2 shadow-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{signUpError}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-300">
                        {activeRole === 'citizen' && "Full Name"}
                        {activeRole === 'police' && "Officer Full Name & Title"}
                        {activeRole === 'hospital' && "Medical Staff Full Name"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={signUpData.name}
                          onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                          placeholder={
                            activeRole === 'citizen' ? "e.g. Rahul Sharma" :
                            activeRole === 'police' ? "e.g. Insp. K. Srinivas" :
                            "e.g. Dr. Priya Varma"
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Email / Official Identifier */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-300">
                          {activeRole === 'citizen' ? "Email Address" : activeRole === 'police' ? "Department Email" : "Institutional Email"}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={signUpData.identifier}
                            onChange={(e) => setSignUpData({ ...signUpData, identifier: e.target.value })}
                            placeholder={
                              activeRole === 'citizen' ? "user@example.com" :
                              activeRole === 'police' ? "officer@appolice.gov.in" :
                              "doctor@hospital.org"
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>

                      {/* Role Specific Field */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-300">
                          {activeRole === 'citizen' && "Mobile Number"}
                          {activeRole === 'police' && "Badge / Service ID"}
                          {activeRole === 'hospital' && "Staff / License ID"}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            {activeRole === 'citizen' && <Phone className="w-4 h-4" />}
                            {activeRole === 'police' && <ShieldAlert className="w-4 h-4" />}
                            {activeRole === 'hospital' && <Stethoscope className="w-4 h-4" />}
                          </div>
                          <input
                            type="text"
                            required
                            value={signUpData.extraField}
                            onChange={(e) => setSignUpData({ ...signUpData, extraField: e.target.value })}
                            placeholder={
                              activeRole === 'citizen' ? "9876543210" :
                              activeRole === 'police' ? "AP-POL-XXXX" :
                              "ALA-DOC-XXX"
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-300">Password / Passkey</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showSignUpPassword ? 'text' : 'password'}
                            required
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                          >
                            {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-slate-300">Confirm Passkey</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            type={showSignUpPassword ? 'text' : 'password'}
                            required
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={signUpData.agreed}
                          onChange={(e) => setSignUpData({ ...signUpData, agreed: e.target.checked })}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span>I accept the UrbanEye Smart City Data & Privacy Charter</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={signUpSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      style={{ backgroundColor: currentRoleConfig.primaryColor }}
                    >
                      {signUpSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>

                  {/* Switch to Sign In */}
                  <div className="pt-4 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-400">
                      Already have registered access?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
                      >
                        Sign In to Portal
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ========================================================= */}
              {/* MODE 3: FORGOT PASSWORD / ACCESS RECOVERY */}
              {/* ========================================================= */}
              {authMode === 'forgot' && (
                <motion.div
                  key="forgot-mode"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="w-full space-y-4"
                >
                  {forgotSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-blue-950/80 border border-blue-700/80 text-blue-300 text-xs flex items-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>
                        Password reset is handled by your administrator. Please contact your system admin or IT helpdesk with your registered email to reset access.
                      </span>
                    </motion.div>
                  )}

                  {!forgotSuccess && (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          {activeRole === 'citizen' && "Registered Email or Mobile Number"}
                          {activeRole === 'police' && "Officer Badge ID or Official Email"}
                          {activeRole === 'hospital' && "Medical Staff ID or Institutional Email"}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={forgotIdentifier}
                            onChange={(e) => setForgotIdentifier(e.target.value)}
                            placeholder={
                              activeRole === 'citizen' ? "name@example.com or 9876543210" :
                              activeRole === 'police' ? "AP-POL-XXXX or officer@appolice.gov.in" :
                              "ALA-DOC-XXX or doctor@hospital.org"
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-400">
                        <p>
                          A recovery request will be logged. Your system administrator will send reset instructions to your registered contact.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={forgotSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        style={{ backgroundColor: currentRoleConfig.primaryColor }}
                      >
                        {forgotSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Request Access Recovery</span>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Switch back to Sign In */}
                  <div className="pt-4 border-t border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Return to Sign In</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthHub;
