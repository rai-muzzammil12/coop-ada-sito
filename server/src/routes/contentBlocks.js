const express = require('express');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const VALID_SECTIONS = ['formula', 'compiti', 'chi_siamo'];

const blockSchema = z.object({
  section: z.enum(VALID_SECTIONS),
  order: z.number().int().default(0),
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  published: z.boolean().default(true),
});

// Public: GET /api/content-blocks?section=formula
router.get('/', async (req, res) => {
  const { section } = req.query;
  if (section && !VALID_SECTIONS.includes(section)) {
    return res.status(400).json({ error: `section deve essere una di: ${VALID_SECTIONS.join(', ')}` });
  }
  const items = await prisma.contentBlock.findMany({
    where: { published: true, ...(section ? { section } : {}) },
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });
  res.json(items);
});

// Admin: full list, optionally filtered, including unpublished
router.get('/admin', requireAuth, async (req, res) => {
  const { section } = req.query;
  const items = await prisma.contentBlock.findMany({
    where: section ? { section } : {},
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });
  res.json(items);
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = blockSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Dati non validi.', details: parsed.error.flatten() });
  }
  const created = await prisma.contentBlock.create({ data: parsed.data });
  res.status(201).json(created);
});

router.put('/:id', requireAuth, async (req, res) => {
  const parsed = blockSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Dati non validi.', details: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.contentBlock.update({ where: { id: req.params.id }, data: parsed.data });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Elemento non trovato.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.contentBlock.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: 'Elemento non trovato.' });
  }
});

module.exports = router;
