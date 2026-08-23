import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

const FIELDS = [
  { key: 'logoUrl', label: 'Logo (percorso immagine, es. /images/logo.jpg)' },
  { key: 'heroImage', label: 'Immagine hero (percorso, es. /images/hero-home.jpg)' },
  { key: 'heroEyebrow', label: 'Sopratitolo hero' },
  { key: 'heroTitleLine1', label: 'Titolo hero (riga 1)' },
  { key: 'heroTitleLine2', label: 'Titolo hero (riga 2, evidenziata)' },
  { key: 'heroSubtitle', label: 'Sottotitolo hero' },
  { key: 'heroBody', label: 'Testo hero', type: 'textarea' },
  { key: 'phone', label: 'Telefono' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Indirizzo / Sede operativa' },
  { key: 'partitaIva', label: 'Partita IVA' },
  { key: 'appointmentsNote', label: 'Nota appuntamenti' },
];

export default function AdminSettings() {
  const { token } = useAuth();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSettings().then(setForm).catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const updated = await api.adminUpdateSettings(token, form);
      setForm(updated);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  if (!form && !error) return <p className="state-message">Caricamento…</p>;
  if (error && !form) return <p className="state-message state-message--error">{error}</p>;

  return (
    <div>
      <div className="admin-page__header">
        <h1>Testi principali del sito</h1>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        {FIELDS.map((f) => (
          <div className="admin-modal__field" key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                id={f.key}
                rows={4}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                id={f.key}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}

        {error && <p className="state-message state-message--error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Salvataggio…' : status === 'saved' ? 'Salvato ✓' : 'Salva modifiche'}
        </button>
      </form>
    </div>
  );
}
