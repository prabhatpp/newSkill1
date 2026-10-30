import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Admin() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/admin/overview')
      .then(response => setOverview(response.data))
      .catch(() => setError('Could not load the admin overview. Please sign in again or check the server.'));
  }, []);

  return (
    <section>
      <h1 className="section-title">Admin dashboard</h1>
      <p className="section-subtitle">Overview of the website content and sections.</p>
      {error && <div className="error-msg">{error}</div>}
      {!overview && !error && <div className="loading">Loading dashboard...</div>}
      {overview && (
        <>
          <div className="cards-grid">
            <article className="feature-card"><h2>{overview.courses}</h2><p>Courses</p></article>
            <article className="feature-card"><h2>{overview.streams}</h2><p>Streams covered</p></article>
            <article className="feature-card"><h2>{overview.books}</h2><p>NCERT books</p></article>
          </div>
          <h2 className="section-title" style={{ marginTop: '2rem' }}>Website sections</h2>
          <div className="cards-grid">
            {overview.sections.map(section => (
              <Link className="feature-card" to={section.path} key={section.path}>
                <h3>{section.name}</h3>
                <span>Open section →</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Admin;
