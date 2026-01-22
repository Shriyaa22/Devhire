import { Request, Response } from 'express';
import { Types } from 'mongoose';
import DeveloperProfile from '../models/DeveloperProfile';

// @route   GET /api/search/developers
// @desc    Search developers with filters
// @access  Private (Recruiter only)
export const searchDevelopers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      skills,
      location,
      availability,
      minCompletion,
      page = '1',
      limit = '12'
    } = req.query;

    console.log('🔍 Search query:', req.query);

    const filter: Record<string, any> = {};

    if (skills && typeof skills === 'string' && skills.trim()) {
      const skillsArray = skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      if (skillsArray.length > 0) {
        filter.skills = { 
          $in: skillsArray.map(skill => new RegExp(skill, 'i'))
        };
      }
    }

    if (location && typeof location === 'string' && location.trim()) {
      filter.location = new RegExp(location.trim(), 'i');
    }

    if (availability && typeof availability === 'string') {
      const validStatuses = ['available', 'open-to-offers', 'not-available'];
      if (validStatuses.includes(availability)) {
        filter.availability = availability;
      }
    }

    if (minCompletion && typeof minCompletion === 'string') {
      const minComp = parseFloat(minCompletion);
      if (!isNaN(minComp) && minComp >= 0 && minComp <= 100) {
        filter.profileCompletion = { $gte: minComp };
      }
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const profiles = await DeveloperProfile.find(filter)
      .populate('userId', 'name email')
      .select('-__v')
      .sort({ profileCompletion: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await DeveloperProfile.countDocuments(filter);

    console.log(`✅ Found ${profiles.length} developers (${total} total)`);

    res.status(200).json({
      success: true,
      data: profiles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error: any) {
    console.error('❌ Search Error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
};

export const getDeveloperProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    const profile = await DeveloperProfile.findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'name email');

    if (!profile) {
      res.status(404).json({ error: 'Developer profile not found' });
      return;
    }

    console.log('✅ Fetched profile for:', userId);

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

export const getSearchStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalDevelopers,
      availableDevelopers,
      completedProfiles,
      topSkills
    ] = await Promise.all([
      DeveloperProfile.countDocuments(),
      DeveloperProfile.countDocuments({ availability: 'available' }),
      DeveloperProfile.countDocuments({ profileCompletion: 100 }),
      DeveloperProfile.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDevelopers,
        availableDevelopers,
        completedProfiles,
        topSkills: topSkills.map((s: any) => ({ 
          skill: s._id, 
          count: s.count 
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Stats Error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};