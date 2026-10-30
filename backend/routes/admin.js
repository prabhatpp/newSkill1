const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Course = require('../models/Course');
const Book = require('../models/Book');

router.use(authMiddleware, authMiddleware.requireAdmin);

router.get('/overview', async (req, res) => {
  try {
    const [courseCount, bookCount, streams] = await Promise.all([
      Course.countDocuments(),
      Book.countDocuments(),
      Course.distinct('stream')
    ]);

    res.json({
      courses: courseCount,
      books: bookCount,
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
