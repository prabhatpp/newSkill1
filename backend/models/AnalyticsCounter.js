const mongoose = require('mongoose');

const analyticsCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  totalVisits: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsCounter', analyticsCounterSchema);
