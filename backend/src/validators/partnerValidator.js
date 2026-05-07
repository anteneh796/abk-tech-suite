const { z } = require('zod');

const partnerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  logo: z.string().url("Valid logo URL is required"),
  website: z.string().url("Valid website URL is required").optional().or(z.literal('')),
  order: z.number().int().optional().default(0)
});

module.exports = {
  partnerSchema
};
