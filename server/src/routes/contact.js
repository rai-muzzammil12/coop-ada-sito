const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Prevent the public contact form from being used to spam the database.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Hai inviato troppe richieste. Riprova più tardi o scrivici direttamente via email.' },
});

const contactSchema = z.object({
  name: z.string().min(1, 'Il nome è obbligatorio.').max(200),
  email: z.string().email('Inserisci un indirizzo email valido.'),
  phone: z.string().max(50).optional().or(z.literal('')),
  message: z.string().min(1, 'Il messaggio è obbligatorio.').max(5000),
  // Honeypot field: real users never fill this in (it's hidden by CSS on
  // the frontend); bots that fill every field will trip it.
  website: z.string().max(0).optional().or(z.literal('')),
});

// Public: submit the contact form.
router.post('/', submitLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return res.status(400).json({ error: firstError || 'Dati del modulo non validi.' });
  }
  const { name, email, phone, message } = parsed.data;

  const submission = await prisma.contactSubmission.create({
    data: { name, email, phone: phone || null, message },
  });

  res.status(201).json({
    ok: true,
    message: 'Grazie! Il tuo messaggio è stato inviato, ti risponderemo al più presto.',
    id: submission.id,
  });
});

// Admin: view all submissions, newest first.
router.get('/admin', requireAuth, async (req, res) => {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(submissions);
});

// Admin: toggle handled/unhandled.
router.put('/admin/:id', requireAuth, async (req, res) => {
  const handled = Boolean(req.body.handled);
  try {
    const updated = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: { handled },
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Richiesta non trovata.' });
  }
});

router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: 'Richiesta non trovata.' });
  }
});

module.exports = router;
