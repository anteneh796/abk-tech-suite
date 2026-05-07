const TimelineItem = require('../models/TimelineItem');
const asyncHandler = require('../utils/asyncHandler');

// List items
exports.list = asyncHandler(async (req, res) => {
  const items = await TimelineItem.find().sort({ order: 1, year: 1 });
  res.json({ items });
});

// Create item
exports.create = asyncHandler(async (req, res) => {
  const { year, title, description, order } = req.body;
  const item = await TimelineItem.create({ year, title, description, order });
  res.status(201).json({ item });
});

// Update item
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { year, title, description, order } = req.body;
  const item = await TimelineItem.findByIdAndUpdate(id, { year, title, description, order }, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Timeline item not found' });
  res.json({ item });
});

// Delete item
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await TimelineItem.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Timeline item not found' });
  res.json({ success: true, message: 'Timeline item deleted' });
});

