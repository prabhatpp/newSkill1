import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const API_URL = process.env.REACT_APP_API_URL || '';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStream, setActiveStream] = useState('All');

  const streams = ['All', 'Science', 'Medical', 'Commerce', 'Arts', 'Other'];

  useEffect(() => {
    const url = activeStream === 'All'
      ? `${API_URL}/api/courses`
      : `${API_URL}/api/courses?stream=${activeStream}`;
    setLoading(true);
    axios.get(url)
      .then(res => { setCourses(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load courses. Please try again.'); setLoading(false); });
  }, [activeStream]);

  return (
    <div>
      <h1 className="section-title">Courses After 12th</h1>
      <p className="section-subtitle">Choose your stream and explore career options</p>

      <div className="filters">
        {streams.map(s => (
          <button
            key={s}
            className={`filter-btn ${activeStream === s ? 'active' : ''}`}
            onClick={() => setActiveStream(s)}
          >{s}</button>
        ))}
      </div>

      {loading && <div className="loading">Loading courses...</div>}
      {error && <div className="error-msg">{error}</div>}
      {!loading && !error && courses.length === 0 && (
        <div className="no-results">No courses found for this stream.</div>
      )}
      {!loading && !error && (
        <div className="cards-grid">
          {courses.map(course => <CourseCard key={course._id} course={course} />)}
        </div>
      )}
    </div>
  );
}

export default Courses;
