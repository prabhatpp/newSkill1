const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: Number, required: true },
  board: { type: String, default: 'CBSE' },
  author: { type: String },
  publisher: { type: String, default: 'NCERT' },
  ncertLink: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
