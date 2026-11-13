import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Footer() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    const loadVisits = () => {
      axios.get('/api/analytics/visits')
        .then(response => setVisits(response.data.visits))
        .catch(() => {});
    };
    const handleVisitUpdate = event => setVisits(event.detail);

    loadVisits();
    window.addEventListener('website-views-updated', handleVisitUpdate);
    const refreshTimer = window.setInterval(loadVisits, 30000);
    return () => {
      window.removeEventListener('website-views-updated', handleVisitUpdate);
      window.clearInterval(refreshTimer);
    };
  }, []);

  return (
    <footer className="footer">
      <p>© 2024 EduPath — Helping students find their path after 12th</p>
      <p className="footer-views" aria-live="polite">
        <span aria-hidden="true">◉</span> Website views: {visits === null ? '—' : Number(visits).toLocaleString('en-IN')}
      </p>
      <p style={{ marginTop: '8px' }}>
        <a href="https://ncert.nic.in" target="_blank" rel="noreferrer">NCERT</a>
        {' | '}
        <a href="https://cbse.gov.in" target="_blank" rel="noreferrer">CBSE</a>
        {' | '}
        <a href="https://nta.ac.in" target="_blank" rel="noreferrer">NTA</a>
      </p>
    </footer>
  );
}

export default Footer;
