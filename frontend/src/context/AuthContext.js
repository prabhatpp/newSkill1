import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

function isUsableToken(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return false;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(window.atob(base64));
    return typeof claims.exp === 'number' && claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interceptorId = axios.interceptors.request.use(config => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) config.headers.Authorization = `Bearer ${storedToken}`;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptorId);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken || !isUsableToken(storedToken)) {
        localStorage.removeItem('auth_token');
        setIsReady(true);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setToken(storedToken);
        setUser(response.data.user);
      } catch {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('auth_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isReady, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
