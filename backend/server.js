require('dotenv').config();

// Fail loudly on startup if critical secrets are missing
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentplatform';

// Middleware
// Render provides the public URL for this single-service deployment. Keeping
// the frontend and API on the same origin also avoids production CORS setup.
const frontendUrl = process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL;
if (frontendUrl) process.env.FRONTEND_URL = frontendUrl;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:8080'];
if (frontendUrl) allowedOrigins.push(frontendUrl);
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/solutions', require('./routes/solutions'));
app.use('/api/books', require('./routes/books'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'student-platform-backend',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve the React build in production when it is present (for example, on
// Render). Local development can continue using the React dev server proxy.
const frontendBuild = path.resolve(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
