const express = require('express');
const router = express.Router();
const Solution = require('../models/Solution');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/solutions?class=12&subject=Maths
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = parseInt(req.query.class);
    if (req.query.subject) filter.subject = req.query.subject;
    const solutions = await Solution.find(filter).sort({ chapterNo: 1 });
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/solutions/:id
router.get('/:id', async (req, res) => {
  try {
    const sol = await Solution.findById(req.params.id);
    if (!sol) return res.status(404).json({ error: 'Solution not found' });
    res.json(sol);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
