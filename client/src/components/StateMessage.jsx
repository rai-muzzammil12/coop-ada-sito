import React from 'react';

export function Loading({ label = 'Caricamento in corso…' }) {
  return <p className="state-message state-message--loading">{label}</p>;
}

export function ErrorMessage({ children }) {
  return <p className="state-message state-message--error">{children}</p>;
}

export function Empty({ children }) {
  return <p className="state-message">{children}</p>;
}
