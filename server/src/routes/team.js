const { z } = require('zod');
const { createCrudRouter } = require('../lib/crudFactory');

const teamMemberSchema = z.object({
  order: z.number().int().default(0),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(true),
});

module.exports = createCrudRouter('teamMember', teamMemberSchema);
