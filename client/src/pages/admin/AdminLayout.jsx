import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Panoramica', end: true },
  { to: '/admin/impostazioni', label: 'Testi principali' },
  { to: '/admin/servizi', label: 'Servizi' },
  { to: '/admin/chi-siamo', label: 'Chi siamo' },
  { to: '/admin/compiti', label: 'Compiti operatore' },
  { to: '/admin/formula', label: 'Formula Zero Pensieri' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/testimonianze', label: 'Testimonianze' },
  { to: '/admin/richieste', label: 'Richieste di contatto' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">COOP ADA · Admin</div>
        <nav>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `admin-layout__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-layout__account">
          <span>{admin?.email}</span>
          <button className="btn btn-outline" onClick={logout}>
            Esci
          </button>
        </div>
      </aside>
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
