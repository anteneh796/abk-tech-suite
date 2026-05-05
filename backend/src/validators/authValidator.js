const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'client', 'innovator', 'technician']).optional(),
  company_name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
})

module.exports = {
  registerSchema,
  loginSchema,
  updateMeSchema,
}
