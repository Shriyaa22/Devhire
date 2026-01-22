import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Shortlist from '../models/Shortlist';
import DeveloperProfile from '../models/DeveloperProfile';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @route   POST /api/shortlist
// @desc    Add developer to shortlist
// @access  Private (Recruiter only)
export const addToShortlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recruiterId = req.user?.id;
    const { developerId, notes } = req.body;

    if (!recruiterId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!developerId) {
      res.status(400).json({ error: 'Developer ID is required' });
      return;
    }

    // Check if already shortlisted
    const existing = await Shortlist.findOne({ 
      recruiterId: new Types.ObjectId(recruiterId), 
      developerId: new Types.ObjectId(developerId) 
    });
    if (existing) {
      res.status(400).json({ error: 'Developer already in shortlist' });
      return;
    }

    // Create shortlist entry
    const shortlist = await Shortlist.create({
      recruiterId: new Types.ObjectId(recruiterId),
      developerId: new Types.ObjectId(developerId),
      notes: notes || ''
    });

    console.log('✅ Added to shortlist:', developerId);

    res.status(201).json({
      success: true,
      message: 'Developer added to shortlist',
      shortlist
    });

  } catch (error: any) {
    console.error('❌ Add to Shortlist Error:', error);
    res.status(500).json({ error: 'Server error adding to shortlist' });
  }
};

// @route   GET /api/shortlist
// @desc    Get recruiter's shortlist
// @access  Private (Recruiter only)
export const getShortlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recruiterId = req.user?.id;

    if (!recruiterId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get shortlist with developer profiles
    const shortlist = await Shortlist.find({ recruiterId: new Types.ObjectId(recruiterId) })
      .populate('developerId', 'name email')
      .sort({ createdAt: -1 });

    // Get full profiles for shortlisted developers
    const developerIds = shortlist.map(s => s.developerId);
    const profiles = await DeveloperProfile.find({ userId: { $in: developerIds } })
      .populate('userId', 'name email');

    // Combine shortlist with profiles
    const result = shortlist.map(s => {
      const profile = profiles.find(p => p.userId._id.toString() === s.developerId.toString());
      return {
        shortlistId: s._id,
        notes: s.notes,
        createdAt: s.createdAt,
        profile
      };
    });

    res.status(200).json({
      success: true,
      shortlist: result
    });

  } catch (error: any) {
    console.error('❌ Get Shortlist Error:', error);
    res.status(500).json({ error: 'Server error fetching shortlist' });
  }
};

// @route   DELETE /api/shortlist/:developerId
// @desc    Remove developer from shortlist
// @access  Private (Recruiter only)
export const removeFromShortlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recruiterId = req.user?.id;
    const { developerId } = req.params;

    if (!recruiterId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await Shortlist.findOneAndDelete({ 
      recruiterId: new Types.ObjectId(recruiterId), 
      developerId: new Types.ObjectId(developerId) 
    });

    if (!result) {
      res.status(404).json({ error: 'Shortlist entry not found' });
      return;
    }

    console.log('✅ Removed from shortlist:', developerId);

    res.status(200).json({
      success: true,
      message: 'Developer removed from shortlist'
    });

  } catch (error: any) {
    console.error('❌ Remove from Shortlist Error:', error);
    res.status(500).json({ error: 'Server error removing from shortlist' });
  }
};

// @route   GET /api/shortlist/check/:developerId
// @desc    Check if developer is in shortlist
// @access  Private (Recruiter only)
export const checkShortlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recruiterId = req.user?.id;
    const { developerId } = req.params;

    if (!recruiterId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const exists = await Shortlist.findOne({ 
      recruiterId: new Types.ObjectId(recruiterId), 
      developerId: new Types.ObjectId(developerId) 
    });

    res.status(200).json({
      success: true,
      isShortlisted: !!exists
    });

  } catch (error: any) {
    console.error('❌ Check Shortlist Error:', error);
    res.status(500).json({ error: 'Server error checking shortlist' });
  }
};