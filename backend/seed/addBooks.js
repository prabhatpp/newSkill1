require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const additionalBooks = require('./additionalBooks');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentplatform';

async function addBooks() {
  try {
    await mongoose.connect(MONGO_URI);
    const results = await Promise.all(additionalBooks.map(book =>
      Book.updateOne(
        { class: book.class, subject: book.subject, title: book.title },
        { $set: book },
        { upsert: true }
      )
    ));

    const added = results.filter(result => result.upsertedCount > 0).length;
    const updated = results.filter(result => result.matchedCount > 0).length;
    console.log(`NCERT book catalog updated: ${added} added, ${updated} updated across Classes 6–12.`);
  } catch (error) {
    console.error('NCERT book catalog update failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

addBooks();
