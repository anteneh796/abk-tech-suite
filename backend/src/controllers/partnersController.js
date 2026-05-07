const Partner = require('../models/Partner');
const asyncHandler = require('../utils/asyncHandler');
const { partnerSchema } = require('../validators/partnerValidator');

// List partners
exports.list = asyncHandler(async (req, res) => {
  const partners = await Partner.find().sort({ order: 1, createdAt: -1 });
  res.json({ partners });
});

// Create partner
exports.create = asyncHandler(async (req, res) => {
  const parseResult = partnerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
  }

  const partner = await Partner.create(parseResult.data);
  res.status(201).json({ partner });
});

// Update partner
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const parseResult = partnerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
  }

  const partner = await Partner.findByIdAndUpdate(id, parseResult.data, { new: true, runValidators: true });
  if (!partner) return res.status(404).json({ message: 'Partner not found' });
  res.json({ partner });
});

// Delete partner
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Partner.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Partner not found' });
  res.json({ success: true, message: 'Partner deleted' });
});

