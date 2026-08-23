# COOP ADA — Sito web + CMS

Sito completo (frontend React + backend Node/Express + database) basato sul
design approvato in `SITO_COOP_ADA_redesigned.pptx`, con pannello di
amministrazione per gestire ogni contenuto senza toccare il codice.

## Struttura del progetto

```
coop-ada/
├── server/     API REST + database (Node.js, Express, Prisma, SQLite)
└── client/     Sito pubblico + pannello admin (React, Vite, React Router)
```

## Cosa è già implementato

- **Sito a pagina singola** (one-page): Home, Formula Zero Pensieri, Chi
  siamo, I nostri servizi, Compiti dell'operatore e Contatti sono tutte
  sezioni della stessa pagina, raggiungibili tramite il menu (scorrimento
  fluido) — non più pagine separate. Il menu evidenzia automaticamente la
  sezione visibile mentre si scorre.
- **Immagini e icone reali del design**: tutte le foto e le icone incluse
  nel file `.pptx` originale sono state estratte e sono ora usate sul sito
  (non più placeholder) — vedi sezione dedicata più sotto.
- **Sito pubblico**, 5 pagine corrispondenti alle slide del design:
  Home, Chi siamo, I nostri servizi, Compiti dell'operatore, Contatti.
- **Modulo di contatto** funzionante (salva le richieste nel database, con
  rate limiting anti-spam e honeypot).
- **Pannello admin** (`/admin`) protetto da login, per gestire:
  testi principali (hero, contatti), Servizi, Chi siamo, Compiti
  dell'operatore, Formula Zero Pensieri, Team, Testimonianze, e l'elenco
  delle richieste ricevute dal form contatti.
- **Database** con dati precaricati (seed) che riproducono i testi reali
  del design originale.
- **Autenticazione** admin con JWT + password hashate (bcrypt).

## Cosa manca / prossimi passi consigliati

Questi non bloccano il funzionamento del sito, ma valuta di aggiungerli:

1. **Sezione Team/Testimonianze in pagina pubblica**: sono già gestibili da
   admin ma non ancora visualizzate su una pagina pubblica (non presenti nel
   design originale a 6 slide) — se vuoi mostrarle, si aggiunge facilmente
   una sezione o pagina dedicata.
3. **Invio email** alla ricezione di una richiesta di contatto (oggi viene
   solo salvata nel database e va letta da `/admin/richieste`). Si può
   aggiungere con un servizio come Resend, Postmark o SMTP.
4. **Cambio password admin** da interfaccia (oggi si resetta da riga di
   comando, vedi sotto).
5. Test automatici (attualmente nessuno).

---

## Immagini e icone del design originale

Tutti i file multimediali inclusi nella presentazione `.pptx` approvata sono
stati estratti e inseriti nel progetto, pronti all'uso — non sono più
placeholder:

```
client/public/
├── favicon.jpg                    Icona del sito (dal logo)
├── images/
│   ├── logo.jpg                   Logo COOP ADA (header + footer)
│   ├── hero-home.jpg              Foto principale della Home
│   ├── service-domiciliare.jpg    Foto card "Assistenza Domiciliare"
│   ├── service-ospedaliera.jpg    Foto card "Assistenza Ospedaliera"
│   └── service-casa.jpg           Foto card "Casa, Colf & Governanti"
└── icons/
    ├── icon-supporto.png / icon-igiene.png / icon-mobilita.png
    ├── icon-compagnia.png / icon-pasti.png / icon-spesa.png
    ├── icon-terapie.png / icon-pulizia.png / icon-famiglia.png
    ├── icon-referente.png / icon-zero-oneri.png / icon-flessibile.png
    ├── icon-prezzo.png            (usate in "Compiti" e "Formula Zero Pensieri")
    └── icon-telefono.png / icon-email.png   (usate nel footer)
```

Le foto e le icone sono già collegate ai contenuti seedati nel database
(`server/prisma/seed.js`) tramite i campi `image` (Servizi) e `icon`
(Servizi, Compiti, Formula) — l'admin panel permette di cambiarle in
qualsiasi momento scrivendo un nuovo percorso (per le foto) o una chiave
diversa dall'elenco sopra (per le icone), senza bisogno di ricompilare il
sito. Per caricare una foto/icona nuova, basta aggiungerla nella cartella
`client/public/images/` o `client/public/icons/` e usarne il percorso
(es. `/images/nuova-foto.jpg`) nel campo corrispondente dell'admin.

---

## 1. Esecuzione in locale

Requisiti: Node.js 18+ e npm.

### Backend

```bash
cd server
cp .env.example .env
# apri .env e imposta JWT_SECRET con una stringa lunga e casuale:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

npm install
npm run prisma:migrate      # crea il database SQLite e le tabelle
npm run seed                # popola con i testi del design + crea l'admin
npm run dev                 # avvia l'API su http://localhost:4000
```

Le credenziali del primo admin sono quelle in `.env`
(`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, di default
`admin@coopada.it` / `ChangeMe123!`) — **cambiale subito** dopo il primo
accesso (vedi sezione "Cambiare la password admin" più sotto).

### Frontend

In un secondo terminale:

```bash
cd client
cp .env.example .env
npm install
npm run dev                 # avvia il sito su http://localhost:5173
```

Apri `http://localhost:5173` per il sito pubblico e
`http://localhost:5173/admin` per il pannello di amministrazione.

---

## 2. Come funziona il CMS

Ogni sezione ripetibile del design (Servizi, Chi siamo, Compiti
dell'operatore, Formula Zero Pensieri, Team, Testimonianze) è gestita da
`/admin` con la stessa interfaccia: elenco → "Aggiungi"/"Modifica" → form →
salva. Il campo **Ordine** controlla la posizione della card nella pagina
pubblica; **Pubblicato = No** nasconde l'elemento dal sito senza cancellarlo.

I testi "fissi" (titolo hero, telefono, email, indirizzo, Partita IVA...)
si modificano da **Admin → Testi principali**.

Le icone dei Servizi/Compiti/Formula sono scelte scrivendo una delle chiavi
disponibili nel campo "Icona" (es. `home-heart`, `hospital`, `home`,
`support`, `hygiene`, `mobility`, `company`, `meal`, `medication`,
`therapy`, `cleaning`, `family`, `referent`, `no-bureaucracy`, `flexible`,
`transparent-price`, `heart`). L'elenco completo è in
`client/src/components/Icon.jsx`.

### Cambiare la password admin

Non c'è ancora un'interfaccia per farlo. Il modo più rapido è rieseguire il
seed con una nuova password:

```bash
cd server
SEED_ADMIN_EMAIL=admin@coopada.it SEED_ADMIN_PASSWORD="NuovaPasswordSicura!" npm run seed
```

(la voce con la stessa email viene aggiornata, non duplicata).

---

## 3. Deploy in produzione — guida passo-passo

Sotto trovi un percorso semplice e gratuito/economico per portare online il
sito: **Render** per il backend + database, **Vercel** per il frontend.
Puoi sostituire questi servizi con altri (Railway, Fly.io, un VPS, ecc.) — i
passaggi concettuali restano gli stessi.

### Passo 0 — Metti il codice su GitHub

```bash
cd coop-ada
git init
git add .
git commit -m "Sito COOP ADA — versione iniziale"
```

Crea un repository vuoto su GitHub (es. `coop-ada-sito`) e collega/pusha:

```bash
git remote add origin https://github.com/TUO-UTENTE/coop-ada-sito.git
git branch -M main
git push -u origin main
```

### Passo 1 — Database in produzione (consigliato: Postgres)

SQLite va benissimo in locale, ma per un deploy affidabile conviene un
database Postgres gestito (persiste anche se il server riavvia/si sposta).
Opzioni gratuite/economiche: **Render Postgres**, **Neon**, **Supabase**,
**Railway**.

1. Crea un database Postgres su uno di questi servizi.
2. Copia la connection string (tipo
   `postgresql://utente:password@host:5432/nomedb`).
3. In `server/prisma/schema.prisma` cambia:
   ```prisma
   datasource db {
     provider = "postgresql"   // era "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Genera la migrazione per Postgres:
   ```bash
   cd server
   rm -rf prisma/migrations   # le migrazioni SQLite non sono compatibili
   DATABASE_URL="postgresql://..." npx prisma migrate dev --name init
   ```

### Passo 2 — Deploy del backend (Render)

1. Vai su [render.com](https://render.com) → **New → Web Service**.
2. Collega il repository GitHub, seleziona la cartella `server` come
   *Root Directory*.
3. Imposta:
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
4. In **Environment**, aggiungi le variabili (stessi nomi di `.env`):
   - `DATABASE_URL` → la connection string Postgres del Passo 1
   - `JWT_SECRET` → una stringa lunga e casuale
   - `CORS_ORIGIN` → l'URL del frontend (lo saprai dopo il Passo 3, per ora
     puoi mettere `*` temporaneamente e restringerlo dopo)
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` → credenziali del primo admin
   - `PORT` → di solito Render lo imposta da solo, ma puoi lasciare `4000`
5. Fai il deploy. Una volta online, esegui una volta sola il seed (dalla
   shell di Render, in **Shell** nel pannello del servizio):
   ```bash
   npm run seed
   ```
6. Annota l'URL pubblico del backend, es.
   `https://coop-ada-api.onrender.com`.

### Passo 3 — Deploy del frontend (Vercel)

1. Vai su [vercel.com](https://vercel.com) → **Add New → Project**.
2. Collega lo stesso repository GitHub, seleziona la cartella `client`
   come *Root Directory*.
3. Framework preset: **Vite**. Build command e output directory di
   default (`npm run build`, `dist`) vanno bene.
4. In **Environment Variables**, aggiungi:
   - `VITE_API_URL` → `https://coop-ada-api.onrender.com/api`
     (l'URL del backend dal Passo 2, con `/api` alla fine)
5. Fai il deploy. Vercel ti darà un URL tipo
   `https://coop-ada-sito.vercel.app`.

### Passo 4 — Collega i due URL

1. Torna su Render, nelle variabili d'ambiente del backend, imposta
   `CORS_ORIGIN` con l'URL esatto del frontend (es.
   `https://coop-ada-sito.vercel.app`), poi riavvia il servizio.
2. Se hai un dominio personalizzato (es. `www.coopada.it`), collegalo sia su
   Vercel (per il sito) sia — se vuoi un sottodominio tipo `api.coopada.it`
   — su Render per il backend, poi aggiorna di conseguenza `CORS_ORIGIN` e
   `VITE_API_URL` e rifai il deploy del frontend.

### Passo 5 — Verifica finale

- Apri il sito pubblico e controlla tutte le pagine.
- Invia un messaggio di prova dal form Contatti.
- Accedi a `/admin`, verifica che il messaggio di prova sia visibile in
  "Richieste di contatto", poi cambia la password admin (vedi sopra) usando
  la Shell di Render con le variabili puntate al database di produzione.

---

## 4. Note di sicurezza prima di andare online

- Cambia **subito** `JWT_SECRET` e la password admin rispetto ai valori di
  esempio.
- Imposta `CORS_ORIGIN` sul dominio reale (non lasciarlo su `*` in
  produzione).
- Il modulo di contatto è già protetto da rate limiting (5 invii/ora per
  IP) e da un campo honeypot anti-bot.
- Valuta di aggiungere backup automatici del database Postgres (i servizi
  citati sopra offrono quasi tutti backup giornalieri inclusi).
