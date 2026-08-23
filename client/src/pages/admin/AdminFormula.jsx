import React from 'react';
import ResourceManager from './ResourceManager';

const FIELDS = [
  { key: 'title', label: 'Titolo', required: true },
  { key: 'description', label: 'Descrizione', type: 'textarea', required: true },
  { key: 'icon', label: 'Icona (chiave)', required: true },
  { key: 'order', label: 'Ordine', type: 'number' },
  { key: 'published', label: 'Pubblicato', type: 'boolean' },
];

export default function AdminFormula() {
  return <ResourceManager resource="content-blocks" title="Formula Zero Pensieri" fields={FIELDS} fixedValues={{ section: 'formula' }} />;
}
