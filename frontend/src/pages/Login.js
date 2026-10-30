import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setVerificationMessage('');
    setResendStatus('');
  };

  const resendVerification = async () => {
    setResendStatus('sending');
    try {
      const res = await axios.post('/api/auth/resend-verification', {
        email: form.email.trim()
      });
      setResendStatus(res.data.message || 'If the account is registered and unverified, a new link has been sent.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Could not resend the verification email. Please try again.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setVerificationMessage('');
    setResendStatus('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      if (message.toLowerCase().includes('verify')) setVerificationMessage(message);
      else setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your EduPath account</p>

      {error && <div className="error-msg">{error}</div>}
      {verificationMessage && (
        <div className="error-msg">
          <p>{verificationMessage}</p>
          <button
            className="auth-btn"
            type="button"
            onClick={resendVerification}
            disabled={resendStatus === 'sending' || !form.email.trim()}
            style={{ marginTop: '12px' }}
          >
            {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
          </button>
          {resendStatus && resendStatus !== 'sending' && <p role="status" style={{ marginTop: '12px' }}>{resendStatus}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Gmail address</label>
          <input
            id="email"
            className="form-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@gmail.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

export default Login;
