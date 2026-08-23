// Renders the actual line icons supplied in the approved COOP ADA design
// (extracted from the .pptx and stored in /public/icons). Kept as one file,
// keyed by the same "icon" string stored on Service/ContentBlock rows, so
// the admin panel's icon picker and the public site always stay in sync.
import React from 'react';

const ICONS = {
  supporto: '/icons/icon-supporto.png',
  igiene: '/icons/icon-igiene.png',
  mobilita: '/icons/icon-mobilita.png',
  compagnia: '/icons/icon-compagnia.png',
  pasti: '/icons/icon-pasti.png',
  spesa: '/icons/icon-spesa.png',
  terapie: '/icons/icon-terapie.png',
  pulizia: '/icons/icon-pulizia.png',
  famiglia: '/icons/icon-famiglia.png',
  referente: '/icons/icon-referente.png',
  'zero-oneri': '/icons/icon-zero-oneri.png',
  flessibile: '/icons/icon-flessibile.png',
  prezzo: '/icons/icon-prezzo.png',
  telefono: '/icons/icon-telefono.png',
  email: '/icons/icon-email.png',
};

export const ICON_KEYS = Object.keys(ICONS);

export default function Icon({ name = 'supporto', size = 28, alt = '', className = '', ...rest }) {
  const src = ICONS[name] || ICONS.supporto;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`icon-img ${className}`}
      {...rest}
    />
  );
}
