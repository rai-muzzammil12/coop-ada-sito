const { z } = require('zod');
const { createCrudRouter } = require('../lib/crudFactory');

const testimonialSchema = z.object({
  order: z.number().int().default(0),
  authorName: z.string().min(1),
  authorRole: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  published: z.boolean().default(true),
});

module.exports = createCrudRouter('testimonial', testimonialSchema);
