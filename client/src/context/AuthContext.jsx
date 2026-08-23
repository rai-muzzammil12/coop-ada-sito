import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);
const STORAGE_KEY = 'coopada_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then((res) => setAdmin(res.admin))
      .catch(() => {
        // Stored token is no longer valid — clear it silently.
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem(STORAGE_KEY, res.token);
    setToken(res.token);
    setAdmin(res.admin);
    return res.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
