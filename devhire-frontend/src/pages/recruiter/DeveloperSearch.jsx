import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { searchDevelopers, addToShortlist } from '../../services/searchService';

function DeveloperSearch() {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    availability: '',
    minCompletion: ''
  });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const searchFilters = {
        ...filters,
        page
      };
      
      // Remove empty filters
      Object.keys(searchFilters).forEach(key => {
        if (!searchFilters[key]) delete searchFilters[key];
      });
      
      const data = await searchDevelopers(searchFilters);
      setDevelopers(data.data);
      setPagination(data.pagination);
      
    } catch (err) {
      setError('Failed to search developers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleAddToShortlist = async (developerId) => {
    try {
      await addToShortlist(developerId);
      alert('Developer added to shortlist!');
    } catch (err) {
      if (err.response?.data?.error === 'Developer already in shortlist') {
        alert('This developer is already in your shortlist');
      } else {
        alert('Failed to add to shortlist');
      }
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/recruiter/developer/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/recruiter/dashboard')}
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <h1 className="text-xl font-bold text-white">Search Developers</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Filters */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-slate-300">Skills</Label>
                <Input
                  name="skills"
                  value={filters.skills}
                  onChange={handleFilterChange}
                  placeholder="e.g., React, Node.js"
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">Comma separated</p>
              </div>

              <div>
                <Label className="text-slate-300">Location</Label>
                <Input
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g., San Francisco"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Availability</Label>
                <select
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="open-to-offers">Open to Offers</option>
                  <option value="not-available">Not Available</option>
                </select>
              </div>

              <div>
                <Label className="text-slate-300">Min Profile %</Label>
                <Input
                  type="number"
                  name="minCompletion"
                  value={filters.minCompletion}
                  onChange={handleFilterChange}
                  placeholder="e.g., 50"
                  min="0"
                  max="100"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => handleSearch(1)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button 
                onClick={() => {
                  setFilters({ skills: '', location: '', availability: '', minCompletion: '' });
                  handleSearch(1);
                }}
                variant="outline"
                className="bg-slate-700 text-white hover:bg-slate-600"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {pagination.total} Developer{pagination.total !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-slate-400 text-sm">
            Page {pagination.page} of {pagination.pages}
          </p>
        </div>

        {/* Developer Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading developers...</div>
          </div>
        ) : developers.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 text-lg">No developers found</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <Card key={dev._id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{dev.userId?.name || 'Anonymous'}</CardTitle>
                      <p className="text-blue-400 text-sm">{dev.title || 'Developer'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dev.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                      dev.availability === 'open-to-offers' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {dev.availability === 'available' ? 'Available' :
                       dev.availability === 'open-to-offers' ? 'Open to Offers' :
                       'Not Available'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Location */}
                  {dev.location && (
                    <p className="text-slate-400 text-sm mb-3">📍 {dev.location}</p>
                  )}

                  {/* Bio */}
                  {dev.bio && (
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{dev.bio}</p>
                  )}

                  {/* Skills */}
                  <div className="mb-3">
                    <p className="text-slate-400 text-xs mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {dev.skills && dev.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {dev.skills && dev.skills.length > 5 && (
                        <span className="text-slate-500 text-xs px-2 py-1">
                          +{dev.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Completion */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Profile</span>
                      <span className="text-blue-400">{dev.profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{width: `${dev.profileCompletion}%`}}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewProfile(dev.userId._id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      View Profile
                    </Button>
                    <Button 
                      onClick={() => handleAddToShortlist(dev.userId._id)}
                      variant="outline"
                      className="bg-slate-700 text-white hover:bg-slate-600"
                      size="sm"
                    >
                      ⭐ Shortlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => handleSearch(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              variant="outline"
              className="bg-slate-700 text-white hover:bg-slate-600"
            >
              Previous
            </Button>
            <span className="text-white px-4 py-2">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => handleSearch(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || loading}
              variant="outline"
              className="bg-slate-700 text-white hover:bg-slate-600"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeveloperSearch;