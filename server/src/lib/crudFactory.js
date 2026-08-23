const express = require('express');
const prisma = require('./prisma');
const { requireAuth } = require('../middleware/auth');

/**
 * Builds a standard REST router for a Prisma model:
 *   GET    /            -> public, published-only, ordered list
 *   GET    /admin        -> admin-only, full list (incl. unpublished)
 *   POST   /             -> admin-only, create
 *   PUT    /:id          -> admin-only, update
 *   DELETE /:id          -> admin-only, delete
 *
 * @param {string} modelName - Prisma delegate name, e.g. "service"
 * @param {import('zod').ZodSchema} schema - validates create/update payloads
 * @param {object} [options]
 * @param {object} [options.publicWhere] - extra filter merged into the public list query
 */
function createCrudRouter(modelName, schema, options = {}) {
  const router = express.Router();
  const model = prisma[modelName];

  router.get('/', async (req, res) => {
    const items = await model.findMany({
      where: { published: true, ...(options.publicWhere || {}) },
      orderBy: { order: 'asc' },
    });
    res.json(items);
  });

  router.get('/admin', requireAuth, async (req, res) => {
    const items = await model.findMany({ orderBy: { order: 'asc' } });
    res.json(items);
  });

  router.post('/', requireAuth, async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dati non validi.', details: parsed.error.flatten() });
    }
    const created = await model.create({ data: parsed.data });
    res.status(201).json(created);
  });

  router.put('/:id', requireAuth, async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Dati non validi.', details: parsed.error.flatten() });
    }
    try {
      const updated = await model.update({ where: { id: req.params.id }, data: parsed.data });
      res.json(updated);
    } catch (err) {
      res.status(404).json({ error: 'Elemento non trovato.' });
    }
  });

  router.delete('/:id', requireAuth, async (req, res) => {
    try {
      await model.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ error: 'Elemento non trovato.' });
    }
  });

  return router;
}

module.exports = { createCrudRouter };
