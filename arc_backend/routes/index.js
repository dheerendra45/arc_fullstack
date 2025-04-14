import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import statsRoutes from './stats.routes.js';
const router = express.Router();

// Health check routes directly in index.js
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

router.get('/health/detailed', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage()
  });
});

// Original routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', statsRoutes);

export default router;
