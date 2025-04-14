// routes/auth.routes.js
import express from 'express';
import { login } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Login route
router.post('/login', login);
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    // User is already verified by authMiddleware
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test protected route
router.get('/me', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Protected route accessed successfully',
    user: req.user 
  });
});

export default router;