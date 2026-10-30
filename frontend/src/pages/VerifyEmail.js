import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [resendStatus, setResendStatus] = useState(null); // null | 'sending' | 'sent' | 'resend-error'
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    axios.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [location.search]);

  function handleResend(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setResendStatus('sending');
    axios.post('/api/auth/resend-verification', { email: email.trim() })
      .then(() => setResendStatus('sent'))
      .catch(() => setResendStatus('resend-error'));
  }

  return (
    <div className="auth-container">
      {status === 'loading' && (
        <>
          <h1 className="auth-title">Verifying your email…</h1>
          <p style={{ color: '#666' }}>Please wait while we verify your account.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 className="auth-title">Email verified! ✅</h1>
          <p style={{ color: '#2e7d32', marginBottom: '20px' }}>
            Your account is now active. You can sign in to EduPath.
          </p>
          <Link to="/login" className="auth-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Go to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="auth-title">Verification failed ❌</h1>
          <p style={{ color: '#c62828', marginBottom: '20px' }}>
            Invalid or expired verification link. Enter your Gmail below to get a new one.
          </p>

          {resendStatus === 'sent' ? (
            <div className="success-msg">
              A new verification link has been sent. Please check your Gmail inbox.
            </div>
          ) : (
            <form onSubmit={handleResend}>
              <div className="form-group">
                <label className="form-label" htmlFor="resend-email">Your Gmail address</label>
                <input
                  id="resend-email"
                  type="email"
                  className="form-input"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={resendStatus === 'sending'}
                />
              </div>
              {resendStatus === 'resend-error' && (
                <p className="error-msg" style={{ marginBottom: '12px' }}>
                  Could not resend. Please try again or <Link to="/login">go to login</Link>.
                </p>
              )}
              <button
                type="submit"
                className="auth-btn"
                disabled={resendStatus === 'sending'}
              >
                {resendStatus === 'sending' ? 'Sending…' : 'Resend Verification Email'}
              </button>
            </form>
          )}

          <div className="auth-link">
            <Link to="/login">Back to Login</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
