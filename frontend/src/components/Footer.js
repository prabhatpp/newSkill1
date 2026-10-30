import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 EduPath — Helping students find their path after 12th</p>
      <p style={{marginTop: '8px'}}>
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
