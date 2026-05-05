const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  challenge: { type: String },
  solution: { type: String },
  result: { type: String },
  beforeImage: { type: String },
  afterImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
