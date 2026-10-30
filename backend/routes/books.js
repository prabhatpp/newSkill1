const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/books?class=12
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = parseInt(req.query.class);
    if (req.query.subject) filter.subject = req.query.subject;
    const books = await Book.find(filter).sort({ class: 1, subject: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
