const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Course = require('../models/Course');
const Book = require('../models/Book');
const AnalyticsCounter = require('../models/AnalyticsCounter');

router.use(authMiddleware, authMiddleware.requireAdmin);

router.get('/overview', async (req, res) => {
  try {
    const [courseCount, bookCount, streams, visitCounter] = await Promise.all([
      Course.countDocuments(),
      Book.countDocuments(),
      Course.distinct('stream'),
      AnalyticsCounter.findById('website').select('totalVisits')
    ]);

    res.json({
      courses: courseCount,
      books: bookCount,
      visits: visitCounter?.totalVisits || 0,
      streams: streams.length,
      sections: [
        { name: 'Courses', path: '/courses' },
        { name: 'NCERT Books', path: '/books' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not load the admin overview.' });
  }
});

module.exports = router;
