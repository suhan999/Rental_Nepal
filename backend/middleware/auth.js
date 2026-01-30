const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware - Request URL:', req.originalUrl);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware - Token exists:', !!token);
    
    if (!token) {
      console.log('Auth Middleware - No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth Middleware - User found:', !!user, user?.role);
    
    if (!user) {
      console.log('Auth Middleware - User not found in database');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('Auth Middleware - Authentication successful');
    next();
  } catch (error) {
    console.log('Auth Middleware - Error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize Middleware - Required roles:', roles);
    console.log('Authorize Middleware - User exists:', !!req.user);
    console.log('Authorize Middleware - User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Authorize Middleware - No user in request');
      return res.status(401).json({ message: 'Access denied' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Authorize Middleware - Role not authorized:', req.user.role, 'not in', roles);
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }

    console.log('Authorize Middleware - Authorization successful');
    next();
  };
};

module.exports = { auth, authorize };