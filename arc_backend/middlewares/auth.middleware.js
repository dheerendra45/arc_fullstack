// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
  console.log("hello")
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    
    // Add user to request object
    req.user = user;
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

export default authMiddleware;