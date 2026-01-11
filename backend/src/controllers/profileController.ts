import { Request, Response } from 'express';
import DeveloperProfile from '../models/DeveloperProfile';
import mongoose from 'mongoose';

// Extend Request to include user from auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private (Developer only)
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let profile = await DeveloperProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('userId', 'name email');

    if (!profile) {
      // Create empty profile if doesn't exist
      profile = await DeveloperProfile.create({ userId: new mongoose.Types.ObjectId(userId) });
      console.log('✅ Created new profile for user:', userId);
    }

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// @route   GET /api/profile/:userId
// @desc    Get any user's profile by ID (for recruiters)
// @access  Private
export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const profile = await DeveloperProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('userId', 'name email');

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Get Profile By ID Error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// @route   PUT /api/profile
// @desc    Update current user's profile
// @access  Private (Developer only)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const updateData = req.body;
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find profile or create if doesn't exist
    let profile = await DeveloperProfile.findOne({ userId: objectId });

    if (!profile) {
      // Create new profile
      profile = new DeveloperProfile({ userId: objectId, ...updateData });
    } else {
      // Update existing profile
      Object.assign(profile, updateData);
    }

    // Calculate completion and save
    (profile as any).calculateCompletion();
    await profile.save();

    console.log('✅ Profile updated for user:', userId, '| Completion:', profile.profileCompletion + '%');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });

  } catch (error: any) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// @route   POST /api/profile/skills
// @desc    Add skills to profile
// @access  Private (Developer only)
export const addSkills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { skills } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!skills || !Array.isArray(skills)) {
      res.status(400).json({ error: 'Skills must be an array' });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    let profile = await DeveloperProfile.findOne({ userId: objectId });

    if (!profile) {
      // Create new profile with skills
      profile = new DeveloperProfile({ userId: objectId, skills });
    } else {
      // Add new skills without duplicates
      const uniqueSkills = [...new Set([...profile.skills, ...skills])];
      profile.skills = uniqueSkills;
    }

    // Calculate and save
    (profile as any).calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Skills added successfully',
      skills: profile.skills,
      profileCompletion: profile.profileCompletion
    });

  } catch (error: any) {
    console.error('❌ Add Skills Error:', error);
    res.status(500).json({ error: 'Server error adding skills' });
  }
};

// @route   DELETE /api/profile/skills/:skill
// @desc    Remove a skill from profile
// @access  Private (Developer only)
export const removeSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { skill } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    const profile = await DeveloperProfile.findOne({ userId: objectId });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Remove the skill
    profile.skills = profile.skills.filter(s => s !== skill);
    
    // Calculate and save
    (profile as any).calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      skills: profile.skills,
      profileCompletion: profile.profileCompletion
    });

  } catch (error: any) {
    console.error('❌ Remove Skill Error:', error);
    res.status(500).json({ error: 'Server error removing skill' });
  }
};

// @route   POST /api/profile/experience
// @desc    Add work experience
// @access  Private (Developer only)
export const addExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const experienceData = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    let profile = await DeveloperProfile.findOne({ userId: objectId });

    if (!profile) {
      // Create new profile with experience
      profile = new DeveloperProfile({ userId: objectId, experience: [experienceData] });
    } else {
      // Add experience to existing profile
      profile.experience.push(experienceData);
    }

    // Calculate and save
    (profile as any).calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience added successfully',
      experience: profile.experience,
      profileCompletion: profile.profileCompletion
    });

  } catch (error: any) {
    console.error('❌ Add Experience Error:', error);
    res.status(500).json({ error: 'Server error adding experience' });
  }
};

// @route   POST /api/profile/projects
// @desc    Add project
// @access  Private (Developer only)
export const addProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const projectData = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    let profile = await DeveloperProfile.findOne({ userId: objectId });

    if (!profile) {
      // Create new profile with project
      profile = new DeveloperProfile({ userId: objectId, projects: [projectData] });
    } else {
      // Add project to existing profile
      profile.projects.push(projectData);
    }

    // Calculate and save
    (profile as any).calculateCompletion();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Project added successfully',
      projects: profile.projects,
      profileCompletion: profile.profileCompletion
    });

  } catch (error: any) {
    console.error('❌ Add Project Error:', error);
    res.status(500).json({ error: 'Server error adding project' });
  }
};