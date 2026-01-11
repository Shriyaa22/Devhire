// Defines database schema for developer profiles
import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript
export interface IDeveloperProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Basic Info
  title: string;  // e.g., "Full Stack Developer"
  bio: string;
  location: string;
  availability: 'available' | 'not-available' | 'open-to-offers';
  
  // Skills
  skills: string[];  // e.g., ["React", "Node.js", "MongoDB"]
  
  // Experience
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;  // Optional if current job
    current: boolean;
    description: string;
  }[];
  
  // Education
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }[];
  
  // Projects
  projects: {
    title: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
  }[];
  
  // Social Links
  socialLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
  
  // Metadata
  profileCompletion: number;  // Percentage 0-100
  createdAt: Date;
  updatedAt: Date;
}

const DeveloperProfileSchema = new Schema<IDeveloperProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // One profile per user
  },
  
  // Basic Info
  title: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  availability: {
    type: String,
    enum: ['available', 'not-available', 'open-to-offers'],
    default: 'available'
  },
  
  // Skills
  skills: {
    type: [String],
    default: []
  },
  
  // Experience
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' }
  }],
  
  // Education
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false }
  }],
  
  // Projects
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    liveUrl: { type: String },
    githubUrl: { type: String },
    imageUrl: { type: String }
  }],
  
  // Social Links
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    twitter: { type: String }
  },
  
  // Metadata
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Method to calculate profile completion percentage
DeveloperProfileSchema.methods.calculateCompletion = function() {
  let completion = 0;
  const fields = [
    { name: 'title', weight: 10 },
    { name: 'bio', weight: 10 },
    { name: 'location', weight: 5 },
    { name: 'skills', weight: 20, min: 3 },  // At least 3 skills
    { name: 'experience', weight: 20, min: 1 },
    { name: 'education', weight: 10, min: 1 },
    { name: 'projects', weight: 15, min: 1 },
    { name: 'socialLinks', weight: 10, min: 1 }
  ];

  fields.forEach(field => {
    const value = this[field.name];
    
    if (field.name === 'skills' || field.name === 'experience' || 
        field.name === 'education' || field.name === 'projects') {
      // Array fields
      if (value && value.length >= (field.min || 1)) {
        completion += field.weight;
      }
    } else if (field.name === 'socialLinks') {
      // Object field - check if at least one link exists
      const links = Object.values(value || {}).filter(Boolean);
      if (links.length >= (field.min || 1)) {
        completion += field.weight;
      }
    } else {
      // String fields
      if (value && value.trim().length > 0) {
        completion += field.weight;
      }
    }
  });

  this.profileCompletion = completion;
  return completion;
};

export default mongoose.model<IDeveloperProfile>('DeveloperProfile', DeveloperProfileSchema);