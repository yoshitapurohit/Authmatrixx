import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(false);
  const [riskInfo, setRiskInfo] = useState(null);

  useEffect(() => {
    if (!token || !user) return;
    authService
      .me()
      .then((res) => {
        setUser(res.data);
        storage.saveSession({ token, user: res.data });
      })
      .catch(() => {
        logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      setRiskInfo(data.risk);
      storage.saveSession({ token: data.token, user: data.user });
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      await authService.register(payload);
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed';
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRiskInfo(null);
    storage.clear();
  };

  const value = {
    user,
    token,
    loading,
    riskInfo,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

