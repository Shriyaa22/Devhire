import { api } from './api';

// Get current user's profile
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update profile (basic info, bio, etc.)
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Add skills
export const addSkills = async (skills) => {
  try {
    const response = await api.post('/profile/skills', { skills });
    return response.data;
  } catch (error) {
    console.error('Error adding skills:', error);
    throw error;
  }
};

// Remove a skill
export const removeSkill = async (skill) => {
  try {
    const response = await api.delete(`/profile/skills/${encodeURIComponent(skill)}`);
    return response.data;
  } catch (error) {
    console.error('Error removing skill:', error);
    throw error;
  }
};

// Add work experience
export const addExperience = async (experienceData) => {
  try {
    const response = await api.post('/profile/experience', experienceData);
    return response.data;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

// Add project
export const addProject = async (projectData) => {
  try {
    const response = await api.post('/profile/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};