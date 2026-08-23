require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/lib/prisma');

async function main() {
  console.log('Seeding database...');

  // --- Admin account -------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@coopada.it';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: 'Amministratore COOP ADA' },
  });
  console.log(`Admin account ready: ${email}`);

  // --- Site settings ---------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });

  // --- Services (slide 3: "I nostri servizi") --------------------------
  const services = [
    {
      order: 1,
      icon: 'supporto',
      image: '/images/service-domiciliare.jpg',
      title: 'Assistenza Domiciliare',
      description: 'Assistenza qualificata diurna e notturna, sia oraria che h24, direttamente a casa.',
    },
    {
      order: 2,
      icon: 'famiglia',
      image: '/images/service-ospedaliera.jpg',
      title: 'Assistenza Ospedaliera',
      description: 'Assistenza per anziani e malati, diurna e notturna, durante i periodi di degenza in struttura.',
    },
    {
      order: 3,
      icon: 'pulizia',
      image: '/images/service-casa.jpg',
      title: 'Casa, Colf & Governanti',
      description: 'Servizio fisso, ad ore o di sostituzione per la gestione quotidiana della casa.',
    },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-service-${s.order}` },
      update: s,
      create: { id: `seed-service-${s.order}`, ...s },
    });
  }

  // --- Chi siamo (slide 2) ----------------------------------------------
  const chiSiamo = [
    {
      order: 1,
      title: 'Una realtà costruita sulle persone.',
      description:
        'Ogni persona ha una storia unica, per questo ogni nostro intervento viene costruito su misura, guidato dal valore che vogliamo dare alla famiglia, ascoltando davvero cosa serve e quando serve.',
    },
    {
      order: 2,
      title: 'Un team affidabile al tuo fianco.',
      description:
        'All\u2019interno di COOP ADA vige una rigorosa attenzione alla selezione del personale e a una costante attenzione alla qualità del servizio. Investiamo con costanza nella formazione, perché ci prendiamo cura di chi si prende cura delle persone che amate.',
    },
  ];
  for (const c of chiSiamo) {
    await prisma.contentBlock.upsert({
      where: { id: `seed-chi-siamo-${c.order}` },
      update: { section: 'chi_siamo', ...c },
      create: { id: `seed-chi-siamo-${c.order}`, section: 'chi_siamo', ...c },
    });
  }

  // --- Compiti dell'operatore (slide 4) ----------------------------------
  const compiti = [
    { order: 1, icon: 'supporto', title: 'Supporto quotidiano', description: 'Presenza e aiuto nelle attività di ogni giorno.' },
    { order: 2, icon: 'igiene', title: 'Igiene della persona', description: 'Cura dell\u2019igiene personale con rispetto e delicatezza.' },
    { order: 3, icon: 'mobilita', title: 'Assistenza motoria', description: 'Supporto negli spostamenti e nella mobilità quotidiana.' },
    { order: 4, icon: 'compagnia', title: 'Compagnia & stimolazione cognitiva', description: 'Momenti di dialogo e attività per la mente.' },
    { order: 5, icon: 'pasti', title: 'Preparazione e somministrazione pasti', description: 'Pasti preparati e serviti secondo le esigenze della persona.' },
    { order: 6, icon: 'spesa', title: 'Spesa e commissioni prescritte', description: 'Gestione della spesa e delle commissioni necessarie.' },
    { order: 7, icon: 'terapie', title: 'Supervisione terapie prescritte', description: 'Attenzione al rispetto degli orari e delle indicazioni mediche.' },
    { order: 8, icon: 'pulizia', title: 'Pulizia generale', description: 'Cura e ordine degli spazi domestici.' },
    { order: 9, icon: 'famiglia', title: 'Comunicazione con la famiglia', description: 'Aggiornamenti costanti e trasparenti verso i familiari.' },
  ];
  for (const c of compiti) {
    await prisma.contentBlock.upsert({
      where: { id: `seed-compiti-${c.order}` },
      update: { section: 'compiti', ...c },
      create: { id: `seed-compiti-${c.order}`, section: 'compiti', ...c },
    });
  }

  // --- Formula Zero Pensieri (slide 5) ------------------------------------
  const formula = [
    { order: 1, icon: 'referente', title: 'Referente dedicato & piano personalizzato', description: 'Un punto di contatto unico e un piano di assistenza cucito sulle tue esigenze.' },
    { order: 2, icon: 'zero-oneri', title: 'Zero oneri burocratici', description: 'Ci occupiamo noi di ogni pratica e adempimento, per te zero pensieri.' },
    { order: 3, icon: 'flessibile', title: 'Servizio flessibile senza vincoli', description: 'Adattiamo il servizio ai tuoi tempi, senza contratti rigidi o vincoli.' },
    { order: 4, icon: 'prezzo', title: 'Prezzo trasparente & continuità garantita', description: 'Un costo chiaro fin dall\u2019inizio e la certezza di continuità nell\u2019assistenza.' },
  ];
  for (const f of formula) {
    await prisma.contentBlock.upsert({
      where: { id: `seed-formula-${f.order}` },
      update: { section: 'formula', ...f },
      create: { id: `seed-formula-${f.order}`, section: 'formula', ...f },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
