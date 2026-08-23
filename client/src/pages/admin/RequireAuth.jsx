import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="state-message">Verifica dell'accesso in corso…</p>;
  if (!token) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
