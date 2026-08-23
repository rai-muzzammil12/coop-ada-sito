const { PrismaClient } = require('@prisma/client');

// Reuse a single PrismaClient instance across the app (and across hot
// reloads in dev) instead of opening a new database connection per import.
const prisma = new PrismaClient();

module.exports = prisma;
