import express from 'express';
import { getStats } from '../controllers/statsController.js';
import  authMiddleware  from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, getStats);

export default router;
