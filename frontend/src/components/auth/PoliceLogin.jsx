import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PoliceLogin = ({ onLoginSuccess, onLogin, onToggleMode }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    badgeNumber: '',
    securityPin: '',
    rememberStation: false,
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
      const role = await login(formData.badgeNumber.trim(), formData.securityPin);
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
              Officer Sign In
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
              Law Enforcement
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your official badge ID and encrypted security passkey.
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
            <span>Officer authenticated! Tactical corridor controls unlocked.</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Badge ID / Department Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Officer Badge ID or Department Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.badgeNumber}
                onChange={(e) => {
                  setFormData({ ...formData, badgeNumber: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="officer@appolice.gov.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition font-mono"
              />
            </div>
          </div>

          {/* Password / Passkey */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Security Passkey / 2FA Token
              </label>
              <button
                type="button"
                onClick={() => onToggleMode && onToggleMode('forgot')}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition cursor-pointer font-medium"
              >
                Reset Passkey?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.securityPin}
                onChange={(e) => {
                  setFormData({ ...formData, securityPin: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition font-mono"
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

          {/* Remember Station */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberStation}
                onChange={(e) => setFormData({ ...formData, rememberStation: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span>Remember this patrol workstation</span>
            </label>
          </div>

          {/* Security Advisory Badge */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300/90 flex items-start gap-2">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>
              All signal preemption and dispatch actions are cryptographically logged with GPS timestamps.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Authenticate Officer</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="pt-5 border-t border-slate-800 text-center mt-4">
        <p className="text-xs text-slate-400">
          Need workstation provisioning?{' '}
          <button
            type="button"
            onClick={() => onToggleMode && onToggleMode('signup')}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer"
          >
            Request Officer Registration
          </button>
        </p>
      </div>
    </div>
  );
};

export default PoliceLogin;
