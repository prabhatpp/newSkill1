import React from 'react';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div className="book-cover" aria-hidden="true">📚</div>
      <h3>{book.title}</h3>
      <p className="meta">Class {book.class} | {book.subject} | {book.board}</p>
      <p className="meta">By {book.author} | {book.publisher}</p>
      <span className={`available-badge ${book.isAvailable ? 'yes' : 'no'}`}>
        {book.isAvailable ? '✓ Available online' : '✕ Not available online'}
      </span>
      {book.ncertLink && (
        <a href={book.ncertLink} target="_blank" rel="noreferrer" className="book-link">
          Open official NCERT textbook portal
        </a>
      )}
    </div>
  );
}

export default BookCard;
