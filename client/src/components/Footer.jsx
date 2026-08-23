import React from 'react';
import Icon from './Icon';
import './Footer.css';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__logo-row">
            <img src="/images/logo.jpg" alt="" className="site-footer__logo-img" />
            <span className="site-footer__logo">COOP ADA</span>
          </div>
          <p className="site-footer__tagline">Assistenza alla persona</p>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Informazioni legali</h3>
          <p>Partita IVA {settings?.partitaIva}</p>
          <p>{settings?.address}</p>
        </div>

        <div className="site-footer__col">
          <h3 className="site-footer__heading">Contatti</h3>
          <p>
            <Icon name="telefono" size={16} className="icon-invert" /> {settings?.phone}
          </p>
          <p>
            <Icon name="email" size={16} className="icon-invert" /> {settings?.email}
          </p>
          <p className="site-footer__note">{settings?.appointmentsNote}</p>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© {year} COOP ADA. Tutti i diritti riservati.</span>
        <a href="#contatti" className="site-footer__cta">
          Scrivici →
        </a>
      </div>
    </footer>
  );
}
