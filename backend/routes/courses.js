const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/courses?stream=Science
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.stream) filter.stream = req.query.stream;
    const courses = await Course.find(filter).sort({ stream: 1, title: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
