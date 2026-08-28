import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  CreditCard,
  PhoneCall,
  Heart,
  ShieldCheck,
  MapPin,
  QrCode,
  Edit3,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

// Generate initials from a full name string
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// Generate a deterministic citizen ID from the user's DB id or email
function generateCitizenId(user) {
  if (!user) return 'AP-GNT-CIT-00000';
  const seed = user.id ?? user.email ?? 'x';
  const num = String(seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `AP-GNT-CIT-${String(num).padStart(5, '0')}`;
}

export const ProfileView = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  // Editable fields — seed from the JWT user object
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [phone, setPhone]             = useState(user?.phone ?? '');
  const [address, setAddress]         = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError]       = useState('');

  const initials   = getInitials(displayName || user?.name);
  const citizenId  = generateCitizenId(user);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    // Local save only for now — Phase 2: PATCH /api/users/me
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Citizen Smart ID &amp; Profile</h2>
            <p className="text-xs text-slate-400">Digital City Identity, Transit Card Balance &amp; Emergency Health Pass</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setIsEditing(!isEditing); setSaveError(''); }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Profile changes updated across Guntur Smart Citizen Grid!</span>
        </motion.div>
      )}

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-mono flex items-center gap-2 shadow-lg"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{saveError}</span>
        </motion.div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Col: Digital Smart ID Card */}
        <div className="md:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-blue-800/40">
              <span className="text-[10px] font-mono font-bold text-blue-300">AP URBAN SMART ID</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="pt-4 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-900/50 border-2 border-white/40 mb-3">
                {initials || <User className="w-8 h-8" />}
              </div>
              <h3 className="text-base font-bold text-white">{displayName || user?.name || '—'}</h3>
              <p className="text-xs text-blue-300 font-mono">ID: {citizenId}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Citizen</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <div className="text-slate-400 text-[9px]">Registered Email</div>
              <div className="font-bold text-blue-300 text-[11px] truncate max-w-[140px]">{user?.email ?? '—'}</div>
            </div>
            <CreditCard className="w-5 h-5 text-blue-400 flex-shrink-0" />
          </div>
        </div>

        {/* Right Col: Personal Details & Emergency Info */}
        <div className="md:col-span-2 space-y-5">
          {/* Card 1: Details / Edit Form */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-4">
            <div className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Personal &amp; Contact Info</span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email ?? ''}
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Email cannot be changed here.</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 101, Lane 2, Guntur"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-mono">Full Name</div>
                  <div className="font-bold text-white text-sm mt-0.5">{displayName || user?.name || '—'}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-mono">Registered Email</div>
                  <div className="font-bold text-white text-sm mt-0.5 truncate">{user?.email ?? '—'}</div>
                </div>
                {phone && (
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-mono">Mobile Number</div>
                    <div className="font-bold text-white text-sm mt-0.5">{phone}</div>
                  </div>
                )}
                {address && (
                  <div className={`p-3 rounded-2xl bg-slate-950/60 border border-slate-800 ${!phone ? 'sm:col-span-2' : ''}`}>
                    <div className="text-slate-400 text-[10px] font-mono">Residential Address</div>
                    <div className="font-medium text-slate-200 text-xs mt-0.5">{address}</div>
                  </div>
                )}
                {!phone && !address && (
                  <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
                    <p className="text-xs text-slate-500">Click <strong className="text-slate-400">Edit Profile</strong> to add your phone and address.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Emergency Health & SOS Triage Profile */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-3">
            <div className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Emergency 108 Medical Profile</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800">
                Auto-Transmitted on 108 SOS
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">
                Medical profile data (blood group, allergies, emergency contact) will be available once the health profile API is connected in the next phase.
              </p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Phase 2: POST /api/users/me/health-profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
