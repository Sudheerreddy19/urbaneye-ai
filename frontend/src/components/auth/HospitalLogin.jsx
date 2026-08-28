import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HospitalLogin = ({ onLoginSuccess, onLogin, onToggleMode }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    staffId: '',
    accessKey: '',
    rememberWorkstation: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const role = await login(formData.staffId.trim(), formData.accessKey);
      setLoginSuccess(true);
      if (onLoginSuccess) onLoginSuccess(role);
      if (onLogin) onLogin(role);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between">
      <div>
        {/* Form Title & Subtitle */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hospital Sign In
            </h3>
            <span className="text-[11px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/50">
              Emergency Care
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your medical staff ID or institutional email to access triage resources.
          </p>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-300 text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Success Notification */}
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Staff authenticated! Emergency bed triage console active.</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Staff ID / Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Medical Staff ID or Hospital Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Stethoscope className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.staffId}
                onChange={(e) => {
                  setFormData({ ...formData, staffId: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="doctor@hospital.org"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition font-mono"
              />
            </div>
          </div>

          {/* Password / Access Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Access Passcode / Security Key
              </label>
              <button
                type="button"
                onClick={() => onToggleMode && onToggleMode('forgot')}
                className="text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer font-medium"
              >
                IT Helpdesk?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.accessKey}
                onChange={(e) => {
                  setFormData({ ...formData, accessKey: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Workstation */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberWorkstation}
                onChange={(e) => setFormData({ ...formData, rememberWorkstation: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900"
              />
              <span>Remember this triage terminal</span>
            </label>
          </div>

          {/* Emergency Hotline Info */}
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-300/90 flex items-start gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
            <span>
              For urgent emergency ambulance corridor sync, reach Emergency Dispatch at 108 / 112 directly.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Access Medical Terminal</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="pt-5 border-t border-slate-800 text-center mt-4">
        <p className="text-xs text-slate-400">
          Need hospital onboarding?{' '}
          <button
            type="button"
            onClick={() => onToggleMode && onToggleMode('signup')}
            className="text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
          >
            Register Hospital Unit
          </button>
        </p>
      </div>
    </div>
  );
};

export default HospitalLogin;
