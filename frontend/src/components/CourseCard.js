import React from 'react';

function CourseCard({ course }) {
  const badgeClass = course.stream.toLowerCase();

  return (
    <div className="course-card">
      <span className={`stream-badge ${badgeClass}`}>{course.stream}</span>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      {course.eligibility && <p className="course-eligibility"><strong>Typical eligibility:</strong> {course.eligibility}</p>}
      <div className="course-meta">
        <span>⏱ {course.duration}</span>
        <span>📝 {course.entranceExam}</span>
      </div>
      {course.careerScope && (
        <p style={{marginTop: '10px', fontSize: '0.85rem', color: '#1a73e8'}}>
          💼 {course.careerScope}
        </p>
      )}
    </div>
  );
}

export default CourseCard;
