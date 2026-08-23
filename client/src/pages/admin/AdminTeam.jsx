import React from 'react';
import ResourceManager from './ResourceManager';

const FIELDS = [
  { key: 'name', label: 'Nome', required: true },
  { key: 'role', label: 'Ruolo', required: true },
  { key: 'bio', label: 'Biografia', type: 'textarea' },
  { key: 'photoUrl', label: 'URL foto' },
  { key: 'order', label: 'Ordine', type: 'number' },
  { key: 'published', label: 'Pubblicato', type: 'boolean' },
];

export default function AdminTeam() {
  return <ResourceManager resource="team" title="Team" fields={FIELDS} />;
}
