import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './components/PublicLayout';
import OnePage from './pages/OnePage';

import AdminLogin from './pages/admin/AdminLogin';
import RequireAuth from './pages/admin/RequireAuth';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminServices from './pages/admin/AdminServices';
import AdminChiSiamo from './pages/admin/AdminChiSiamo';
import AdminCompiti from './pages/admin/AdminCompiti';
import AdminFormula from './pages/admin/AdminFormula';
import AdminTeam from './pages/admin/AdminTeam';
import AdminTestimonianze from './pages/admin/AdminTestimonianze';
import AdminRichieste from './pages/admin/AdminRichieste';

// Old multi-page URLs redirect to the matching anchor on the single page,
// so any previously shared/bookmarked links keep working.
const LEGACY_REDIRECTS = [
  { from: '/chi-siamo', to: '/#chi-siamo' },
  { from: '/servizi', to: '/#servizi' },
  { from: '/servizi/compiti-operatore', to: '/#compiti-operatore' },
  { from: '/contatti', to: '/#contatti' },
];

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public single-page site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<OnePage />} />
          {LEGACY_REDIRECTS.map((r) => (
            <Route key={r.from} path={r.from} element={<Navigate to={r.to} replace />} />
          ))}
        </Route>

        {/* Admin panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="impostazioni" element={<AdminSettings />} />
          <Route path="servizi" element={<AdminServices />} />
          <Route path="chi-siamo" element={<AdminChiSiamo />} />
          <Route path="compiti" element={<AdminCompiti />} />
          <Route path="formula" element={<AdminFormula />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="testimonianze" element={<AdminTestimonianze />} />
          <Route path="richieste" element={<AdminRichieste />} />
        </Route>

        {/* Anything else falls back to the single page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
