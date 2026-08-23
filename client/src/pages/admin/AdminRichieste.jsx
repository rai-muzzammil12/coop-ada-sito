import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function AdminRichieste() {
  const { token } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api.adminListContacts(token));
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleHandled(item) {
    try {
      await api.adminSetContactHandled(token, item.id, !item.handled);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Eliminare la richiesta di ${item.name}?`)) return;
    try {
      await api.adminDeleteContact(token, item.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1>Richieste di contatto</h1>
      </div>

      {error && <p className="state-message state-message--error">{error}</p>}
      {!items && !error && <p className="state-message">Caricamento…</p>}
      {items && items.length === 0 && <p className="state-message">Nessuna richiesta ricevuta finora.</p>}

      {items && items.length > 0 && (
        <div className="admin-inbox">
          {items.map((item) => (
            <div className={`admin-inbox__item ${item.handled ? 'is-handled' : ''}`} key={item.id}>
              <div className="admin-inbox__meta">
                <strong>{item.name}</strong>
                <span>{item.email}</span>
                {item.phone && <span>{item.phone}</span>}
                <span className="admin-inbox__date">{new Date(item.createdAt).toLocaleString('it-IT')}</span>
              </div>
              <p className="admin-inbox__message">{item.message}</p>
              <div className="admin-inbox__actions">
                <button className="btn-link" onClick={() => toggleHandled(item)}>
                  {item.handled ? 'Segna come da gestire' : 'Segna come gestita'}
                </button>
                <button className="btn-link btn-link--danger" onClick={() => remove(item)}>
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
