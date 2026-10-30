const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

function createTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (!user || !pass) {
    const error = new Error('Email delivery is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD on the backend.');
    error.code = 'MAIL_NOT_CONFIGURED';
    throw error;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function mailErrorMessage(err) {
  if (err.code === 'MAIL_NOT_CONFIGURED') return err.message;
  if (err.code === 'EAUTH') {
    return 'Gmail rejected the SMTP credentials. Set GMAIL_USER to the sender Gmail address and GMAIL_APP_PASSWORD to a valid Google App Password.';
  }
  return 'Could not send the verification email. Check the backend mail settings and try again.';
}

async function sendVerificationEmail(user, verificationToken) {
  const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
  const verifyUrl = `${frontendBase}/verify-email?token=${verificationToken}`;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Student Platform" <${process.env.GMAIL_USER.trim()}>`,
    to: user.email,
    subject: 'Verify your email — Student Platform',
    text: `Welcome to EduPath, ${user.name}! Verify your email to activate your account: ${verifyUrl}\nThis link expires in 24 hours.`,
    html: `<p>Welcome to EduPath, ${escapeHtml(user.name)}!</p><p>Please verify your Gmail address to activate your account.</p><p><a href="${verifyUrl}">Verify your email</a></p><p>This link expires in 24 hours.</p>`
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, class: userClass, stream } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validation
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      return res.status(400).json({ message: 'A valid @gmail.com email address is required.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (!['11', '12', 'Other'].includes(userClass)) {
      return res.status(400).json({ message: 'Please select a valid class.' });
    }
    if (!['Science', 'Commerce', 'Arts', 'Other'].includes(stream)) {
      return res.status(400).json({ message: 'Please select a valid stream.' });
    }

    // Check existing email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      if (existing.isVerified) {
        return res.status(400).json({ message: 'This email is already registered. Please sign in instead.' });
      }

      // The user may have been saved before a previous verification email failed.
      const retryToken = crypto.randomBytes(32).toString('hex');
      existing.verificationToken = retryToken;
      existing.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await existing.save();
      await sendVerificationEmail(existing, retryToken);
      return res.status(200).json({ message: 'A new verification email was sent. Please check your Gmail inbox.' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      class: userClass,
      stream,
      isVerified: false,
      verificationToken,
      verificationExpires
    });
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    return res.status(201).json({ message: 'Registration successful! Please check your Gmail to verify your account.' });
  } catch (err) {
    console.error('Register error:', err.code || err.message);
    const mailError = ['MAIL_NOT_CONFIGURED', 'EAUTH'].includes(err.code);
    return res.status(mailError ? 503 : 500).json({
      message: mailError
        ? mailErrorMessage(err)
        : 'Could not complete registration or send the verification email. Check the backend mail settings and try again.'
    });
  }
});

// GET /api/auth/verify-email?token=TOKEN
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error('Verify email error:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const allowUnverifiedLogin = ['1', 'true', 'yes', 'local', 'development'].includes(
      String(process.env.ALLOW_UNVERIFIED_LOGIN || '').toLowerCase()
    );

    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail) || typeof password !== 'string' || !password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified && !allowUnverifiedLogin) {
      return res.status(401).json({ message: 'Please verify your Gmail first. Check your inbox for the verification email.' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        stream: user.stream,
        role: authMiddleware.getRole(user)
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET /api/auth/me (protected)
router.get('/me', authMiddleware, (req, res) => {
  const user = req.user;
  return res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      class: user.class,
      stream: user.stream,
      role: req.userRole
    }
  });
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      return res.status(400).json({ message: 'A valid @gmail.com email address is required.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return success to prevent user enumeration
      return res.status(200).json({ message: 'If that email is registered and unverified, a new verification link has been sent.' });
    }
    if (user.isVerified) {
      // Return generic 200 to avoid leaking account existence for verified users
      return res.status(200).json({ message: 'If that email is registered and unverified, a new verification link has been sent.' });
    }

    // Regenerate token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    return res.status(200).json({ message: 'Verification email resent. Please check your Gmail inbox.' });
  } catch (err) {
    console.error('Resend verification error:', err.code || err.message);
    const mailError = ['MAIL_NOT_CONFIGURED', 'EAUTH'].includes(err.code);
    return res.status(mailError ? 503 : 500).json({ message: mailErrorMessage(err) });
  }
});

module.exports = router;
