import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cf_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persistUser = (userData, token) => {
    localStorage.setItem('cf_token', token);
    localStorage.setItem('cf_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistUser(data.user, data.token);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    persistUser(data.user, data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
