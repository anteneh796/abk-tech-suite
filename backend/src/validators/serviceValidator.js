const { z } = require('zod');

const serviceCreateSchema = z.object({
  category: z.string().nonempty(),
  title: z.string().min(3),
  description: z.string().optional(),
  features: z.preprocess((val) => {
    // Accept comma-separated string or array
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
    return undefined;
  }, z.array(z.string()).optional()),
});

module.exports = { serviceCreateSchema };
