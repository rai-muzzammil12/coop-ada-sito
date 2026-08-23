const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const settingsSchema = z.object({
  logoUrl: z.string().min(1),
  heroImage: z.string().min(1),
  heroEyebrow: z.string().min(1),
  heroTitleLine1: z.string().min(1),
  heroTitleLine2: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroBody: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  partitaIva: z.string().min(1),
  appointmentsNote: z.string().min(1),
});

// Public: read the current site copy.
router.get('/', async (req, res) => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });
  res.json(settings);
});

// Admin: update the site copy.
router.put('/', requireAuth, async (req, res) => {
  const parsed = settingsSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Dati non validi.', details: parsed.error.flatten() });
  }
  const updated = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: parsed.data,
    create: { id: 'main', ...parsed.data },
  });
  res.json(updated);
});

module.exports = router;
