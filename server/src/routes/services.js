const { z } = require('zod');
const { createCrudRouter } = require('../lib/crudFactory');

const serviceSchema = z.object({
  order: z.number().int().default(0),
  icon: z.string().min(1).default('supporto'),
  image: z.string().optional().default(''),
  title: z.string().min(1),
  description: z.string().min(1),
  published: z.boolean().default(true),
});

module.exports = createCrudRouter('service', serviceSchema);
