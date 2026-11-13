const express = require('express');
const router = express.Router();
const AnalyticsCounter = require('../models/AnalyticsCounter');

// Count one site open without recording identifying visitor data.
router.post('/visit', async (req, res) => {
  try {
    const counter = await AnalyticsCounter.findOneAndUpdate(
      { _id: 'website' },
      { $inc: { totalVisits: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ visits: counter.totalVisits });
  } catch (error) {
    return res.status(500).json({ message: 'Could not record this visit.' });
  }
});

// The aggregate total is public; visitor identities are never collected.
router.get('/visits', async (req, res) => {
  try {
    const counter = await AnalyticsCounter.findById('website').select('totalVisits');
    return res.json({ visits: counter?.totalVisits || 0 });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load the website view count.' });
  }
});

module.exports = router;
