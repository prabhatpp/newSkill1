import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isReady, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🎓 EduPath</Link>
      {isAuthenticated && (
        <ul className="navbar-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''}>Courses</Link></li>
          <li><Link to="/books" className={location.pathname === '/books' ? 'active' : ''}>Books</Link></li>
          {isAdmin && <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link></li>}
        </ul>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isReady ? null : isAuthenticated ? (
          <>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                transition: 'background 0.2s'
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'background 0.2s'
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
