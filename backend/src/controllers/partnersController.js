const Partner = require('../models/Partner');

exports.list = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ order: 1, createdAt: -1 });
    res.json({ partners });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, logo, website, order } = req.body;
    const partner = await Partner.create({ name, logo, website, order });
    res.status(201).json({ partner });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, website, order } = req.body;
    const partner = await Partner.findByIdAndUpdate(id, { name, logo, website, order }, { new: true });
    res.json({ partner });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Partner.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
