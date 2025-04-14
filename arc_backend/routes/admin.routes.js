import express from 'express';
import {
  getAllUsers,
  softDeleteUser
} from '../controllers/user.controller.js';

import {
  getAllOpportunities,
  updateOpportunityStatus
} from '../controllers/opportunity.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', softDeleteUser);

// Opportunity management
router.get('/opportunities', getAllOpportunities);
router.patch('/opportunity/:id/status', updateOpportunityStatus);

export default router;
