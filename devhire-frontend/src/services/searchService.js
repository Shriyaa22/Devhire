import { api } from './api';

// Search developers with filters
export const searchDevelopers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.location) params.append('location', filters.location);
    if (filters.availability) params.append('availability', filters.availability);
    if (filters.minCompletion) params.append('minCompletion', filters.minCompletion);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString ? `/search/developers?${queryString}` : '/search/developers';
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching developers:', error);
    throw error;
  }
};

// Get developer profile by user ID
export const getDeveloperProfile = async (userId) => {
  try {
    const response = await api.get(`/search/developers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    throw error;
  }
};

// Get search statistics
export const getSearchStats = async () => {
  try {
    const response = await api.get('/search/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Add developer to shortlist
export const addToShortlist = async (developerId, notes = '') => {
  try {
    const response = await api.post('/shortlist', { developerId, notes });
    return response.data;
  } catch (error) {
    console.error('Error adding to shortlist:', error);
    throw error;
  }
};

// Get recruiter's shortlist
export const getShortlist = async () => {
  try {
    const response = await api.get('/shortlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching shortlist:', error);
    throw error;
  }
};

// Remove from shortlist
export const removeFromShortlist = async (developerId) => {
  try {
    const response = await api.delete(`/shortlist/${developerId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from shortlist:', error);
    throw error;
  }
};

// Check if developer is shortlisted
export const checkShortlist = async (developerId) => {
  try {
    const response = await api.get(`/shortlist/check/${developerId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking shortlist:', error);
    throw error;
  }
};