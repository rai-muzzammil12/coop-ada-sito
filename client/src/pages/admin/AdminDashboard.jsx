import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function AdminDashboard() {
  const { token, admin } = useAuth();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    Promise.all([
      api.adminList('services', token),
      api.adminListContacts(token),
      api.adminList('testimonials', token),
      api.adminList('team', token),
    ])
      .then(([services, contacts, testimonials, team]) => {
        setCounts({
          services: services.length,
          pendingContacts: contacts.filter((c) => !c.handled).length,
          totalContacts: contacts.length,
          testimonials: testimonials.length,
          team: team.length,
        });
      })
      .catch(() => setCounts(null));
  }, [token]);

  return (
    <div>
      <div className="admin-page__header">
        <h1>Ciao, {admin?.name || admin?.email}</h1>
      </div>
      <p className="state-message" style={{ marginTop: -12 }}>
        Da qui puoi gestire tutti i contenuti del sito COOP ADA: testi principali, servizi, sezioni informative, team,
        testimonianze e le richieste ricevute dal modulo di contatto.
      </p>

      {counts && (
        <div className="admin-stats">
          <Link to="/admin/richieste" className="admin-stats__card">
            <span className="admin-stats__value">{counts.pendingContacts}</span>
            <span>Richieste da gestire</span>
          </Link>
          <div className="admin-stats__card">
            <span className="admin-stats__value">{counts.services}</span>
            <span>Servizi pubblicati</span>
          </div>
          <div className="admin-stats__card">
            <span className="admin-stats__value">{counts.team}</span>
            <span>Membri del team</span>
          </div>
          <div className="admin-stats__card">
            <span className="admin-stats__value">{counts.testimonials}</span>
            <span>Testimonianze</span>
          </div>
        </div>
      )}
    </div>
  );
}
