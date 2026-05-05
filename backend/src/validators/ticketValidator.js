const { z } = require('zod')

const ticketCreateSchema = z.object({
  service_type: z.string().min(2),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('low'),
  description: z.string().min(5).optional(),
})

const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'resolved', 'closed']).optional(),
  progress_message: z.string().optional(),
  technician_name: z.string().optional(),
})

module.exports = { ticketCreateSchema, statusUpdateSchema }
