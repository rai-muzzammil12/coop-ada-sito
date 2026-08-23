import React from 'react';
import ResourceManager from './ResourceManager';

const FIELDS = [
  { key: 'authorName', label: 'Nome autore', required: true },
  { key: 'authorRole', label: 'Ruolo/relazione' },
  { key: 'content', label: 'Testimonianza', type: 'textarea', required: true },
  { key: 'rating', label: 'Valutazione (1-5)', type: 'number' },
  { key: 'order', label: 'Ordine', type: 'number' },
  { key: 'published', label: 'Pubblicato', type: 'boolean' },
];

export default function AdminTestimonianze() {
  return <ResourceManager resource="testimonials" title="Testimonianze" fields={FIELDS} />;
}
