const TimelineItem = require('../models/TimelineItem');

exports.list = async (req, res) => {
  try {
    const items = await TimelineItem.find().sort({ order: 1, year: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { year, title, description, order } = req.body;
    const item = await TimelineItem.create({ year, title, description, order });
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, description, order } = req.body;
    const item = await TimelineItem.findByIdAndUpdate(id, { year, title, description, order }, { new: true });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await TimelineItem.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
