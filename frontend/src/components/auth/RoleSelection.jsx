import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  ShieldAlert,
  Building2,
  ChevronRight,
  ShieldCheck,
  Lock,
  Headphones,
  Award,
  Radio,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

const roles = [
  {
    id: 'citizen',
    title: 'User / Citizen',
    category: 'Public Services & Transit',
    description: 'Find buses, check traffic, book ambulance, report hazards and more.',
    icon: User,
    accentColor: '#2563EB',
    badgeText: 'Citizen Access',
    hoverBorder: 'hover:border-blue-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.35)]',
    iconBg: 'bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white',
    badgeStyle: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
    pillText: 'Public Transit & SOS',
  },
  {
    id: 'police',
    title: 'Police Control',
    category: 'Law Enforcement & Traffic Control',
    description: 'Monitor city traffic, manage incidents, control signals and dispatch teams.',
    icon: ShieldAlert,
    accentColor: '#059669',
    badgeText: 'Command & Dispatch',
    hoverBorder: 'hover:border-emerald-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_-5px_rgba(5,150,105,0.35)]',
    iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white',
    badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    pillText: 'Tactical Corridor Grid',
  },
  {
    id: 'hospital',
    title: 'Hospital',
    category: 'Emergency Medical Operations',
    description: 'Manage incoming ambulances, patients, beds and hospital resources.',
    icon: Building2,
    accentColor: '#DC2626',
    badgeText: 'Emergency & Triage',
    hoverBorder: 'hover:border-red-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.35)]',
    iconBg: 'bg-red-600/20 text-red-400 border border-red-500/30 group-hover:bg-red-600 group-hover:text-white',
    badgeStyle: 'bg-red-950/80 text-red-300 border-red-800/60',
    pillText: 'Preemption & ICU Beds',
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Authentication' },
  { icon: Lock, label: 'Encrypted Data' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Award, label: 'Trusted by Cities' },
];

export const RoleSelection = ({ onSelectRole }) => {
  const [hoveredRole, setHoveredRole] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between smart-city-grid p-4 sm:p-6 lg:p-8">
      {/* Decorative Top Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-gradient-to-b from-blue-600/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b border-slate-800/60 pb-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3.5">
          {/* Logo icon with glowing gradient background */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-red-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner">
              <Layers className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>UrbanEye</span>
                <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v1.0 Stage-1
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Smarter City. Safer Lives.
            </p>
          </div>
        </div>

        {/* Live Corridor Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Node:</span>
            <span className="font-semibold text-emerald-400">Guntur-Amaravati Corridor</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-3xl w-full mx-auto my-auto py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-6 sm:space-y-8"
        >
          {/* Hero Titles */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Unified Smart City Access Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Choose Your Role
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
              Select the portal you want to access to proceed with targeted real-time telemetry and management controls.
            </p>
          </motion.div>

          {/* Role Cards (Vertical List of 3 Wide Horizontal Cards) */}
          <motion.div variants={containerVariants} className="w-full space-y-4">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <motion.div
                  key={role.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onHoverStart={() => setHoveredRole(role.id)}
                  onHoverEnd={() => setHoveredRole(null)}
                  onClick={() => onSelectRole && onSelectRole(role.id)}
                  className={`group relative w-full cursor-pointer text-left rounded-2xl p-4 sm:p-5 transition-all duration-300 glass-panel border border-slate-800 ${role.hoverBorder} ${role.hoverGlow}`}
                >
                  {/* Subtle Corner Accent Highlight */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-tr-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${role.accentColor}, transparent 70%)`,
                    }}
                  />

                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Icon & Text Info */}
                    <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* Role Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${role.iconBg}`}
                      >
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white transition-colors">
                            {role.title}
                          </h3>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${role.badgeStyle}`}
                          >
                            {role.badgeText}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 sm:line-clamp-none group-hover:text-slate-300 transition-colors">
                          {role.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Chevron Arrow with Hover Translation */}
                    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all duration-300">
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>

      {/* BOTTOM FOOTER: Trust Badges Strip */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-6 border-t border-slate-800/60 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {trustBadges.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-center sm:justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-700/80 transition duration-200"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-blue-400 flex-shrink-0">
                  <BadgeIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-300 text-center sm:text-left whitespace-nowrap">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] font-mono text-slate-400">
            UrbanEye AI Urban Operating System • Guntur / Amaravati Capital Smart Grid Deployment
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelection;
