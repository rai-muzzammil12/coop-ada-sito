import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

/**
 * Generic list+form manager for a CRUD resource. `fields` describes the
 * editable fields (drives both the form inputs and the list preview), so
 * Services/Team/Testimonials/ContentBlocks can all reuse this one screen
 * instead of four near-identical hand-written admin pages.
 *
 * @param {string} resource - REST path segment, e.g. "services"
 * @param {string} title
 * @param {Array<{key, label, type, required?}>} fields
 * @param {object} [fixedValues] - values merged into every create/update (e.g. { section: 'formula' })
 */
export default function ResourceManager({ resource, title, fields, fixedValues = {} }) {
  const { token } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null = not editing, {} = new, object = existing
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const params = fixedValues.section ? { section: fixedValues.section } : undefined;
      const data = await api.adminList(resource, token, params);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, token]);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    const blank = {};
    fields.forEach((f) => {
      blank[f.key] = f.type === 'boolean' ? true : f.type === 'number' ? 0 : '';
    });
    setEditing({ ...blank, ...fixedValues });
  }

  function startEdit(item) {
    setEditing({ ...item });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...editing, ...fixedValues };
      fields.forEach((f) => {
        if (f.type === 'number') payload[f.key] = Number(payload[f.key]) || 0;
      });
      if (editing.id) {
        await api.adminUpdate(resource, token, editing.id, payload);
      } else {
        await api.adminCreate(resource, token, payload);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Eliminare "${item.title || item.name || item.authorName}"? L'azione non è reversibile.`)) return;
    try {
      await api.adminDelete(resource, token, item.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1>{title}</h1>
        <button className="btn btn-primary" onClick={startCreate}>
          + Aggiungi
        </button>
      </div>

      {error && <p className="state-message state-message--error">{error}</p>}
      {!items && !error && <p className="state-message">Caricamento…</p>}

      {items && items.length === 0 && <p className="state-message">Nessun elemento presente.</p>}

      {items && items.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ordine</th>
              <th>{fields[0]?.label}</th>
              <th>Pubblicato</th>
              <th aria-label="Azioni" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td>{item[fields[0]?.key]}</td>
                <td>{item.published === false ? 'No' : 'Sì'}</td>
                <td className="admin-table__actions">
                  <button className="btn-link" onClick={() => startEdit(item)}>
                    Modifica
                  </button>
                  <button className="btn-link btn-link--danger" onClick={() => handleDelete(item)}>
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <form className="admin-modal__card" onSubmit={handleSave}>
            <h2>{editing.id ? 'Modifica elemento' : 'Nuovo elemento'}</h2>
            {fields.map((f) => (
              <div className="admin-modal__field" key={f.key}>
                <label htmlFor={f.key}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={f.key}
                    rows={4}
                    required={f.required}
                    value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                ) : f.type === 'boolean' ? (
                  <select
                    id={f.key}
                    value={String(editing[f.key])}
                    onChange={(e) => setEditing((s) => ({ ...s, [f.key]: e.target.value === 'true' }))}
                  >
                    <option value="true">Sì</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    id={f.key}
                    type={f.type === 'number' ? 'number' : 'text'}
                    required={f.required}
                    value={editing[f.key] ?? ''}
                    onChange={(e) => setEditing((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}

            <div className="admin-modal__actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
                Annulla
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Salvataggio…' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
