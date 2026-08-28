import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  googleAuth as apiGoogleAuth,
  getMe,
  TOKEN_KEY,
  saveSession,
  clearSession,
  getSavedUser,
  getToken,
  backendRoleToFrontend,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]         = useState(true); // restoring session

  // ── Restore session from localStorage on mount ───────────────────────────
  useEffect(() => {
    const savedUser = getSavedUser();
    const token     = getToken();
    if (savedUser && token) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // ── Derived role for routing ─────────────────────────────────────────────
  // user.role is the frontend role string: 'citizen' | 'police' | 'hospital'
  const role = user?.role ?? null;

  // ── Login (email + password) ─────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const frontendRole = backendRoleToFrontend(data.role);
    // Save token first so getMe() can attach it
    localStorage.setItem(TOKEN_KEY, data.token);
    // Fetch full profile from DB (includes phone field)
    let userObj = {
      id:    data.userId,
      name:  data.name,
      email: data.email,
      role:  frontendRole,
      phone: '',
    };
    try {
      const profile = await getMe();
      userObj = {
        id:    profile.id ?? data.userId,
        name:  profile.name ?? data.name,
        email: profile.email ?? data.email,
        phone: profile.phone ?? '',
        role:  frontendRole,
      };
    } catch (_) { /* keep JWT data if /me fails */ }
    saveSession(data.token, userObj);
    setUser(userObj);
    setIsAuthenticated(true);
    return frontendRole;
  };

  // ── Register (new user) ──────────────────────────────────────────────────
  const register = async ({ name, email, phone, password, frontendRole }) => {
    const data = await apiRegister({ name, email, phone, password, frontendRole });
    const resolvedRole = backendRoleToFrontend(data.role);
    const userObj = {
      id:    data.userId,
      name:  data.name,
      email: data.email,
      role:  resolvedRole,
    };
    saveSession(data.token, userObj);
    setUser(userObj);
    setIsAuthenticated(true);
    return resolvedRole;
  };

  // ── Google / SSO Auth ────────────────────────────────────────────────────
  const googleLogin = async ({ email, name, frontendRole }) => {
    const data = await apiGoogleAuth({ email, name, frontendRole });
    const resolvedRole = backendRoleToFrontend(data.role);
    const userObj = {
      id:    data.userId,
      name:  data.name,
      email: data.email,
      role:  resolvedRole,
    };
    saveSession(data.token, userObj);
    setUser(userObj);
    setIsAuthenticated(true);
    return resolvedRole;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    role,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
