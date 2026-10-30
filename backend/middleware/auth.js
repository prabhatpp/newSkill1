const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getRole(user) {
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  return adminEmail && user.email.toLowerCase() === adminEmail ? 'admin' : 'user';
}

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    req.userRole = getRole(user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports.getRole = getRole;

module.exports.requireAdmin = function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};
