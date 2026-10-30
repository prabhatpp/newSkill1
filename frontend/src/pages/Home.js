import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Find Your Path After 12th</h1>
        <p>Explore career paths and access NCERT books for Classes 6–12.</p>
        <Link to="/courses" className="hero-btn">Explore Courses</Link>
        <Link to="/books" className="hero-btn outline">Get Books</Link>
      </section>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">47</div>
          <div className="stat-label">Career Paths</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">5</div>
          <div className="stat-label">Streams Covered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">128</div>
          <div className="stat-label">NCERT Books</div>
        </div>
      </div>

      <h2 className="section-title">What We Offer</h2>
      <p className="section-subtitle">Explore courses and find NCERT textbooks by class</p>

      <div className="features-grid">
        <Link to="/courses" className="feature-card">
          <div className="feature-icon" aria-hidden="true">🎯</div>
          <h3>Courses After 12th</h3>
          <p>Explore JEE, NEET, CA, Law, Engineering, Medical and many more career paths based on your stream.</p>
        </Link>
        <Link to="/books" className="feature-card">
          <div className="feature-icon" aria-hidden="true">📚</div>
          <h3>NCERT Books by Class</h3>
          <p>Browse NCERT textbooks for Classes 6–12 and open the official NCERT textbook portal.</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
