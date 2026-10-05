import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import Icon from '../components/Icon';
import { Loading, ErrorMessage } from '../components/StateMessage';

const initialContactForm = { name: '', email: '', phone: '', message: '', website: '' };

export default function OnePage() {
  const { settings } = useOutletContext();

  const [formula, setFormula] = useState(null);
  const [chiSiamo, setChiSiamo] = useState(null);
  const [services, setServices] = useState(null);
  const [compiti, setCompiti] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getContentBlocks('formula').then(setFormula),
      api.getContentBlocks('chi_siamo').then(setChiSiamo),
      api.getServices().then(setServices),
      api.getContentBlocks('compiti').then(setCompiti),
    ]).catch((err) => setError(err.message));
  }, []);

  // Contact form state
  const [form, setForm] = useState(initialContactForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [contactError, setContactError] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setContactError('');
    try {
      await api.submitContact(form);
      setStatus('sent');
      setForm(initialContactForm);
    } catch (err) {
      setStatus('error');
      setContactError(err.message);
    }
  }

  return (
    <>
      {/* ---------- HOME / HERO ---------- */}
      <section id="home" className="hero">
        <div className="container hero__inner">
          <div>
            <span className="eyebrow">{settings?.heroEyebrow || 'ASSISTENZA ALLA PERSONA'}</span>
            <h1 className="hero__title">
              {settings?.heroTitleLine1 || 'Costruiamo valore'}
              <br />
              <span className="accent-italic">{settings?.heroTitleLine2 || 'insieme.'}</span>
            </h1>
            <p className="hero__subtitle">{settings?.heroSubtitle}</p>
            <p className="hero__body">{settings?.heroBody}</p>
            <a href="#servizi" className="btn btn-primary">
              Scopri di più <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero__media">
            <img
              src={settings?.heroImage || '/images/hero-home.jpg'}
              alt="Operatrice COOP ADA che assiste con cura una persona anziana"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ---------- FORMULA ZERO PENSIERI ---------- */}
      <section id="formula" className="section section--tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Formula Zero Pensieri</span>
            <h2>
              La tranquillità che cerchi, racchiusa in una{' '}
              <span className="accent-italic">Formula Zero Pensieri</span>.
            </h2>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {!formula && !error && <Loading />}
          {formula && (
            <div className="grid grid-4">
              {formula.map((item) => (
                <div className="card" key={item.id}>
                  <div className="icon-circle">
                    <Icon name={item.icon} />
                  </div>
                  <h3 className="card__title">{item.title}</h3>
                  <p className="card__desc">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- CHI SIAMO ---------- */}
      <section id="chi-siamo" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Chi siamo</span>
            <h2>Chi siamo.</h2>
          </div>

          {!chiSiamo && !error && <Loading />}
          {chiSiamo && (
            <div className="grid grid-2 chi-siamo__grid">
              {chiSiamo.map((block, i) => (
                <div
                  className={`chi-siamo__panel ${i === 0 ? 'chi-siamo__panel--muted' : 'chi-siamo__panel--accent'}`}
                  key={block.id}
                >
                  <h3>{block.title}</h3>
                  <p>{block.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- I NOSTRI SERVIZI ---------- */}
      <section id="servizi" className="section section--tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">I nostri servizi</span>
            <h2>I nostri servizi.</h2>
            <p className="section-head__sub">
              Assistenza qualificata domiciliare e ospedaliera per anziani, malati e disabili.
            </p>
          </div>

          {!services && !error && <Loading />}
          {services && (
            <div className="grid grid-3">
              {services.map((s, i) => (
                <div className="card service-card" key={s.id}>
                  {s.image && (
                    <div className="service-card__photo">
                      <img src={s.image} alt="" loading="lazy" />
                    </div>
                  )}
                  <div className="service-card__number">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="card__title">{s.title}</h3>
                  <p className="card__desc">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="servizi__cta">
            <a href="#compiti-operatore" className="btn btn-outline">
              Scopri i compiti dell&apos;operatore →
            </a>
          </div>
        </div>
      </section>

      {/* ---------- COMPITI DELL'OPERATORE ---------- */}
      <section id="compiti-operatore" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Compiti dell&apos;operatore</span>
            <h2>Compiti dell&apos;operatore.</h2>
            <p className="section-head__sub">Un supporto completo, ogni giorno.</p>
          </div>

          {!compiti && !error && <Loading />}
          {compiti && (
            <div className="grid grid-3 compiti__grid">
              {compiti.map((b) => (
                <div className="compiti__item" key={b.id}>
                  <div className="icon-circle icon-circle--sm">
                    <Icon name={b.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="compiti__title">{b.title}</h3>
                    <p className="compiti__desc">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- CONTATTI ---------- */}
      <section id="contatti" className="section section--tint">
        <div className="container contatti__grid">
          <div>
            <span className="eyebrow">Contatti</span>
            <h2 className="contatti__title">
              Iniziamo a costruire <span className="accent-italic">il percorso insieme.</span>
            </h2>
            <p className="contatti__lead">
              Parlaci delle tue esigenze. Il team COOP ADA è pronto ad ascoltarti e trovare la soluzione più
              su misura per la tua famiglia.
            </p>

            <dl className="contatti__facts">
              <div>
                <dt>Sede Operativa</dt>
                <dd>{settings?.address}</dd>
              </div>
              <div>
                <dt>Telefono</dt>
                <dd>{settings?.phone}</dd>
              </div>
              <div>
                <dt>Email generale</dt>
                <dd>{settings?.email}</dd>
              </div>
              <div>
                <dt>Informazioni legali</dt>
                <dd>Partita IVA {settings?.partitaIva}</dd>
              </div>
            </dl>
            <p className="contatti__note">{settings?.appointmentsNote}</p>
          </div>

          <form className="contact-form card" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__field">
              <label htmlFor="name">Nome e cognome</label>
              <input id="name" required value={form.name} onChange={update('name')} autoComplete="name" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
            </div>
            <div className="contact-form__field">
              <label htmlFor="phone">Telefono (facoltativo)</label>
              <input id="phone" value={form.phone} onChange={update('phone')} autoComplete="tel" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="message">Messaggio</label>
              <textarea id="message" rows={5} required value={form.message} onChange={update('message')} />
            </div>

            {/* Honeypot — hidden from real users via CSS, invisible to screen
                readers via aria-hidden + tabIndex. */}
            <div className="contact-form__honeypot" aria-hidden="true">
              <label htmlFor="website">Non compilare questo campo</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Invio in corso…' : 'Invia richiesta'}
            </button>

            {status === 'sent' && (
              <p className="contact-form__status contact-form__status--ok" role="status">
                Grazie! Il tuo messaggio è stato inviato, ti risponderemo al più presto.
              </p>
            )}
            {status === 'error' && (
              <p className="contact-form__status contact-form__status--error" role="alert">
                {contactError}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
