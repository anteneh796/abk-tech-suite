const mongoose = require('mongoose');

const categories = ['Industrial', 'Renewable', 'Generator', 'Innovation', 'Medical'];

const ServiceSchema = new mongoose.Schema({
  category: { type: String, enum: categories, required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  features: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
