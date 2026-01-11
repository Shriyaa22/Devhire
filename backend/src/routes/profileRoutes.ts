// Defines API endpoints
import express from 'express';
import {
  getProfile,
  getProfileById,
  updateProfile,
  addSkills,
  removeSkill,
  addExperience,
  addProject
} from '../controllers/profileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/profile
// @desc    Get current user's profile
router.get('/', getProfile);

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID (for recruiters viewing profiles)
router.get('/:userId', getProfileById);

// @route   PUT /api/profile
// @desc    Update profile
router.put('/', updateProfile);

// @route   POST /api/profile/skills
// @desc    Add skills
router.post('/skills', addSkills);

// @route   DELETE /api/profile/skills/:skill
// @desc    Remove a skill
router.delete('/skills/:skill', removeSkill);

// @route   POST /api/profile/experience
// @desc    Add work experience
router.post('/experience', addExperience);

// @route   POST /api/profile/projects
// @desc    Add project
router.post('/projects', addProject);

export default router;