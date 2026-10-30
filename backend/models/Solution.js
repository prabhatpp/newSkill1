const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  class: { type: Number, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  chapterNo: { type: Number, required: true },
  content: { type: String, required: true },
  keyPoints: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Solution', solutionSchema);
