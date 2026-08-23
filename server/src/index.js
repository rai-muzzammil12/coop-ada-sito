require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const contentBlockRoutes = require('./routes/contentBlocks');
const teamRoutes = require('./routes/team');
const testimonialRoutes = require('./routes/testimonials');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');

const app = express();

// Security headers on every response.
app.use(helmet());

// Only allow the configured frontend origin(s) to call this API from a browser.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/content-blocks', contentBlockRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

// 404 for any unmatched /api route.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato.' });
});

// Generic error handler — keeps stack traces out of API responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Si è verificato un errore interno del server.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`COOP ADA API in ascolto sulla porta ${PORT}`);
});
