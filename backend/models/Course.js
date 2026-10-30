const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  stream: { type: String, required: true, enum: ['Science', 'Medical', 'Commerce', 'Arts', 'Other'] },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  eligibility: { type: String },
  careerScope: { type: String },
  entranceExam: { type: String },
  universities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
