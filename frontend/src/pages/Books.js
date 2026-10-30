import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API_URL = process.env.REACT_APP_API_URL || '';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  useEffect(() => {
    const url = filterClass === 'All'
      ? `${API_URL}/api/books`
      : `${API_URL}/api/books?class=${filterClass}`;
    setLoading(true);
    axios.get(url)
      .then(res => { setBooks(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load books.'); setLoading(false); });
  }, [filterClass]);

  return (
    <div>
      <h1 className="section-title">NCERT Books</h1>
      <p className="section-subtitle">Browse NCERT textbooks by class. Links open NCERT’s official textbook portal.</p>

      <div className="filters">
        <span style={{color:'#666', fontSize:'0.9rem'}}>Filter by class:</span>
        {['All', '6', '7', '8', '9', '10', '11', '12'].map(cls => (
          <button
            key={cls}
            className={`filter-btn ${filterClass === cls ? 'active' : ''}`}
            onClick={() => setFilterClass(cls)}
          >{cls === 'All' ? 'All Classes' : `Class ${cls}`}</button>
        ))}
      </div>

      {loading && <div className="loading">Loading books...</div>}
      {error && <div className="error-msg">{error}</div>}
      {!loading && !error && books.length === 0 && (
        <div className="no-results">No books found.</div>
      )}
      {!loading && !error && (
        <div className="cards-grid">
          {books.map(book => <BookCard key={book._id} book={book} />)}
        </div>
      )}
    </div>
  );
}

export default Books;
