const { z } = require('zod')

const applySchema = z.object({
  project_name: z.string().min(2),
  sector: z.string().optional(),
  description: z.string().optional(),
  funding_requested: z.string().optional(),
  team_size: z.number().optional(),
  bmc_url: z.string().url().optional(),
  pitch_url: z.string().url().optional(),
  incubation_stage: z.enum(['Ideation', 'Prototyping', 'Market_Ready']).optional(),
})

module.exports = { applySchema }