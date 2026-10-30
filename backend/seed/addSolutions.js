require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Solution = require('../models/Solution');
const additionalSolutions = require('./additionalSolutions');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentplatform';

async function addSolutions() {
  try {
    await mongoose.connect(MONGO_URI);
    const results = await Promise.all(additionalSolutions.map(solution =>
      Solution.updateOne(
        { class: solution.class, subject: solution.subject, chapterNo: solution.chapterNo },
        { $set: solution },
        { upsert: true }
      )
    ));

    const added = results.filter(result => result.upsertedCount > 0).length;
    const updated = results.filter(result => result.matchedCount > 0).length;
    console.log(`Solutions updated: ${added} added, ${updated} updated for Classes 6–10.`);
  } catch (error) {
    console.error('Solution update failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

addSolutions();
