require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const additionalCourses = require('./additionalCourses');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentplatform';

async function addCourses() {
  try {
    await mongoose.connect(MONGO_URI);

    const results = await Promise.all(additionalCourses.map(course =>
      Course.updateOne({ title: course.title }, { $set: course }, { upsert: true })
    ));

    const medicalUpdates = await Course.updateMany(
      { title: { $in: ['MBBS / Medical', 'Pharmacy (B.Pharm)'] } },
      { $set: { stream: 'Medical' } }
    );

    const added = results.filter(result => result.upsertedCount > 0).length;
    const updated = results.filter(result => result.matchedCount > 0).length + medicalUpdates.modifiedCount;
    console.log(`Course catalog updated: ${added} added, ${updated} updated, ${additionalCourses.length} new options available.`);
  } catch (error) {
    console.error('Course catalog update failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

addCourses();
