const jwt = require('jsonwebtoken');

// Protects admin-only routes. Expects "Authorization: Bearer <token>".
// The token is issued by POST /api/auth/login and expires after 12 hours.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Accesso non autorizzato. Effettua il login.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessione scaduta o non valida. Effettua di nuovo il login.' });
  }
}

module.exports = { requireAuth };
