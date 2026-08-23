import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const NAV = [
  { href: '#home', label: 'Home' },
  { href: '#chi-siamo', label: 'Chi siamo' },
  { href: '#servizi', label: 'I nostri servizi' },
  { href: '#contatti', label: 'Contatti' },
];

const SECTION_IDS = ['home', 'formula', 'chi-siamo', 'servizi', 'compiti-operatore', 'contatti'];

// Anchors used by the nav map to whichever section is currently in view, so
// "Chi siamo" stays highlighted while scrolling through the Formula section
// too (they visually belong together, same as adjacent slides in the design).
const NAV_TARGET_FOR_SECTION = {
  home: '#home',
  formula: '#home',
  'chi-siamo': '#chi-siamo',
  servizi: '#servizi',
  'compiti-operatore': '#servizi',
  contatti: '#contatti',
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those visible.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0].target.id;
        setActiveHref(NAV_TARGET_FOR_SECTION[id] || '#home');
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(href) {
    return (e) => {
      e.preventDefault();
      setOpen(false);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
    };
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" onClick={handleNavClick('#home')}>
          <img src="/images/logo.jpg" alt="COOP ADA" className="site-header__logo" />
          <span className="site-header__brand-text">
            <span className="site-header__brand-name">COOP ADA</span>
            <span className="site-header__brand-tag">Assistenza alla persona</span>
          </span>
        </Link>

        <button
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="main-nav" className={`site-header__nav ${open ? 'is-open' : ''}`}>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`site-header__link ${activeHref === item.href ? 'is-active' : ''}`}
              onClick={handleNavClick(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
