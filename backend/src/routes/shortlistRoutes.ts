import express from 'express';
import { 
  addToShortlist, 
  getShortlist, 
  removeFromShortlist,
  checkShortlist 
} from '../controllers/shortlistController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/shortlist
// @desc    Add developer to shortlist
router.post('/', addToShortlist);

// @route   GET /api/shortlist
// @desc    Get recruiter's shortlist
router.get('/', getShortlist);

// @route   GET /api/shortlist/check/:developerId
// @desc    Check if developer is shortlisted
router.get('/check/:developerId', checkShortlist);

// @route   DELETE /api/shortlist/:developerId
// @desc    Remove from shortlist
router.delete('/:developerId', removeFromShortlist);

export default router;