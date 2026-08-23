import React from 'react';
import ResourceManager from './ResourceManager';

const FIELDS = [
  { key: 'title', label: 'Titolo', required: true },
  { key: 'description', label: 'Descrizione', type: 'textarea', required: true },
  { key: 'order', label: 'Ordine', type: 'number' },
  { key: 'published', label: 'Pubblicato', type: 'boolean' },
];

export default function AdminChiSiamo() {
  return <ResourceManager resource="content-blocks" title="Chi siamo" fields={FIELDS} fixedValues={{ section: 'chi_siamo' }} />;
}
