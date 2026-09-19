import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CitizenLogin = ({ onLoginSuccess, onLogin, onToggleMode }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
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
      const role = await login(formData.identifier.trim(), formData.password);
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
              Citizen Sign In
            </h3>
            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/50">
              Public Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your email or registered phone number to access public services.
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
            <span>Authentication successful! Access granted to Citizen Portal.</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email / Phone Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => {
                  setFormData({ ...formData, identifier: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => onToggleMode && onToggleMode('forgot')}
                className="text-xs text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In as Citizen</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="pt-5 border-t border-slate-800 text-center mt-4">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onToggleMode && onToggleMode('signup')}
            className="text-blue-400 hover:text-blue-300 font-medium transition cursor-pointer"
          >
            Sign Up for UrbanEye
          </button>
        </p>
      </div>
    </div>
  );
};

export default CitizenLogin;
