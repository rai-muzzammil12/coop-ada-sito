import React from 'react';
import ResourceManager from './ResourceManager';

const FIELDS = [
  { key: 'title', label: 'Titolo', required: true },
  { key: 'description', label: 'Descrizione', type: 'textarea', required: true },
  { key: 'image', label: 'Foto (percorso, es. /images/service-domiciliare.jpg)' },
  { key: 'icon', label: 'Icona (chiave, es. supporto)', required: true },
  { key: 'order', label: 'Ordine', type: 'number' },
  { key: 'published', label: 'Pubblicato', type: 'boolean' },
];

export default function AdminServices() {
  return <ResourceManager resource="services" title="Servizi" fields={FIELDS} />;
}
