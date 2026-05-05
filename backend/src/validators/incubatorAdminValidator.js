const { z } = require('zod')

const normalizeStatus = (val) => {
  if (typeof val !== 'string') return val
  const s = val.toLowerCase()
  const map = {
    pending: 'Pending',
    review: 'Pending', // accept frontend 'review' and treat as Pending
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return map[s] || val
}

const applicationStatusSchema = z.object({
  status: z.preprocess(normalizeStatus, z.enum(['Pending', 'Approved', 'Rejected'])),
  admin_note: z.string().optional(),
})

module.exports = { applicationStatusSchema }