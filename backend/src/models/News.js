const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['news', 'event'], default: 'news' },
  date: { type: Date, default: Date.now },
  excerpt: { type: String, required: true },
  content: { type: String },
  image: { type: String },
  location: { type: String }, // Optional: for events
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
