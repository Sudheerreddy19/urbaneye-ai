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
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [oauthLoading, setOauthLoading] = useState(null); // 'Google' | 'Microsoft' | null

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

  // Google OAuth: send email + role to backend which creates/finds the user
  const handleOAuth = async (provider) => {
    const email = formData.identifier.trim();
    if (!email) {
      setErrorMessage('Please enter your email address first.');
      return;
    }
    setOauthLoading(provider);
    setErrorMessage('');
    try {
      const role = await googleLogin({ email, name: '', frontendRole: 'citizen' });
      setLoginSuccess(true);
      if (onLoginSuccess) onLoginSuccess(role);
      if (onLogin) onLogin(role);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setOauthLoading(null);
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
            disabled={isSubmitting || oauthLoading !== null}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sign In as Citizen</span>
            )}
          </button>
        </form>

        {/* Social Logins */}
        <div className="mt-4 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-2.5 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth('Google')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-60 shadow-sm"
            >
              {oauthLoading === 'Google' ? (
                <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.5 1.9 7.2l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.9c-.2-.7-.4-1.4-.4-2.2 0-.8.2-1.5.4-2.2L1.9 7.6C.7 10 0 12.7 0 15.6s.7 5.6 1.9 8l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z" />
                </svg>
              )}
              <span>{oauthLoading === 'Google' ? 'Connecting...' : 'Google'}</span>
            </button>

            {/* Microsoft OAuth Button */}
            <button
              type="button"
              disabled={oauthLoading !== null || isSubmitting}
              onClick={() => handleOAuth('Microsoft')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-60 shadow-sm"
            >
              {oauthLoading === 'Microsoft' ? (
                <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
              )}
              <span>{oauthLoading === 'Microsoft' ? 'Connecting...' : 'Microsoft'}</span>
            </button>
          </div>
        </div>
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
