const { z } = require('zod');

const projectCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  challenge: z.string().nullable().optional().or(z.literal("")),
  solution: z.string().nullable().optional().or(z.literal("")),
  result: z.string().nullable().optional().or(z.literal("")),
  image: z.any().optional().nullable()
});

module.exports = {
  projectCreateSchema
};
