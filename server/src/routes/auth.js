const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force attempts against the admin login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Troppi tentativi di accesso. Riprova tra qualche minuto.' },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email o password mancanti o non valide.' });
  }
  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ error: 'Credenziali non valide.' });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenziali non valide.' });
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});

// Lets the admin panel confirm a stored token is still valid on page load.
router.get('/me', requireAuth, async (req, res) => {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin.id } });
  if (!admin) return res.status(404).json({ error: 'Amministratore non trovato.' });
  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
});

module.exports = router;
