import express from 'express';
import { searchDevelopers, getDeveloperProfile, getSearchStats } from '../controllers/searchController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/search/developers
// @desc    Search developers with filters
router.get('/developers', searchDevelopers);

// @route   GET /api/search/developers/:userId
// @desc    Get developer profile by ID
router.get('/developers/:userId', getDeveloperProfile);

// @route   GET /api/search/stats
// @desc    Get search statistics
router.get('/stats', getSearchStats);

export default router;