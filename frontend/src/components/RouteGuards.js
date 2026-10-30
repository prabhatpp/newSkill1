import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CheckingSession() {
  return <div className="loading" role="status">Checking your session...</div>;
}

export function RequireAuth({ children }) {
  const { isReady, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isReady) return <CheckingSession />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export function RequireAdmin({ children }) {
  const { isReady, isAuthenticated, isAdmin } = useAuth();

  if (!isReady) return <CheckingSession />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
