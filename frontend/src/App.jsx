import React from 'react';
import { UrbanDataProvider } from './context/UrbanDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelection from './components/auth/RoleSelection';
import AuthHub from './components/auth/AuthHub';
import HospitalDashboard from './components/dashboards/hospital/HospitalDashboard';
import PoliceDashboard from './components/dashboards/police/PoliceDashboard';
import CitizenDashboard from './components/dashboards/citizen/CitizenDashboard';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Inner app — reads auth state from AuthContext (JWT-backed).
 * selectedRole is used only for the pre-login role picker UX;
 * once authenticated, the real role comes from the JWT via AuthContext.
 */
function MainApp() {
  const { isAuthenticated, role, logout, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState(null);

  const handleSelectRole = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  // Called by AuthHub/login forms after successful auth;
  // AuthContext already updated isAuthenticated + role via the login() call.
  const handleLogin = (resolvedRole) => {
    if (resolvedRole) setSelectedRole(resolvedRole);
  };

  const handleLogout = () => {
    logout();
    setSelectedRole(null);
  };

  // Show nothing while restoring session from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-blue-600/30 selection:text-blue-300">
      <AnimatePresence mode="wait">
        {/* 1. Authenticated as Citizen → Citizen Intelligence Dashboard */}
        {isAuthenticated && role === 'citizen' && (
          <motion.div
            key="citizen-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CitizenDashboard onLogout={handleLogout} />
          </motion.div>
        )}

        {/* 2. Authenticated as Police → Police Tactical Dashboard */}
        {isAuthenticated && role === 'police' && (
          <motion.div
            key="police-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PoliceDashboard onLogout={handleLogout} />
          </motion.div>
        )}

        {/* 3. Authenticated as Hospital → Hospital Dashboard */}
        {isAuthenticated && role === 'hospital' && (
          <motion.div
            key="hospital-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HospitalDashboard onLogout={handleLogout} />
          </motion.div>
        )}

        {/* 4. Not authenticated + no role selected → Role Selection */}
        {!isAuthenticated && !selectedRole && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <RoleSelection onSelectRole={handleSelectRole} />
          </motion.div>
        )}

        {/* 5. Not authenticated + role selected → AuthHub */}
        {!isAuthenticated && selectedRole && (
          <motion.div
            key="auth-hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AuthHub
              initialRole={selectedRole}
              onBack={handleBackToRoles}
              onLogin={handleLogin}
              onLoginSuccess={handleLogin}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UrbanDataProvider>
        <MainApp />
      </UrbanDataProvider>
    </AuthProvider>
  );
}
