import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Star, StarOff, Eye, Mail, Phone, Award, Code, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock auth context - replace with actual useAuth
const useAuth = () => ({
  user: { name: 'Sarah Wilson', email: 'sarah@company.com', token: 'mock-token' }
});

function RecruiterSearchDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [developers, setDevelopers] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, searched: 0 });
  const [expandedProfile, setExpandedProfile] = useState(null);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
    fetchShortlist();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock API call - replace with actual API
      setStats({ total: 42, shortlisted: 5, searched: 18 });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      // const response = await fetch('http://localhost:5000/api/shortlist', {
      //   headers: { 'Authorization': `Bearer ${user.token}` }
      // });
      // const data = await response.json();
      
      // Mock data
      setShortlist([
        {
          userId: { _id: '1', name: 'Alex Kumar', email: 'alex@email.com' },
          bio: 'Full-stack developer with 5 years experience',
          location: 'Bangalore, India',
          experience: '5 years',
          skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          education: 'B.Tech in Computer Science',
          phone: '+91-9876543210',
          linkedin: 'linkedin.com/in/alexkumar',
          github: 'github.com/alexkumar'
        }
      ]);
    } catch (err) {
      setError('Failed to load shortlist');
    } finally {
      setLoading(false);
    }
  };

  const searchDevelopers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.append('skills', searchQuery);
      if (locationFilter) params.append('location', locationFilter);
      if (experienceFilter) params.append('experience', experienceFilter);
      
      // Mock API call - replace with actual API
      // const response = await fetch(`http://localhost:5000/api/search/developers?${params}`, {
      //   headers: { 'Authorization': `Bearer ${user.token}` }
      // });
      // const data = await response.json();
      
      // Mock data
      setDevelopers([
        {
          userId: { _id: '2', name: 'Priya Sharma', email: 'priya@email.com' },
          bio: 'Frontend specialist passionate about UX',
          location: 'Mumbai, India',
          experience: '3 years',
          skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
          education: 'MCA from Mumbai University',
          phone: '+91-9876543211',
          linkedin: 'linkedin.com/in/priyasharma',
          github: 'github.com/priyasharma'
        },
        {
          userId: { _id: '3', name: 'Rahul Verma', email: 'rahul@email.com' },
          bio: 'Backend engineer specializing in microservices',
          location: 'Delhi, India',
          experience: '6 years',
          skills: ['Node.js', 'Python', 'Docker', 'Kubernetes'],
          education: 'B.E. in Software Engineering',
          phone: '+91-9876543212',
          linkedin: 'linkedin.com/in/rahulverma',
          github: 'github.com/rahulverma'
        }
      ]);
      
      setStats(prev => ({ ...prev, searched: prev.searched + 1 }));
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShortlist = async (developer) => {
    try {
      const isShortlisted = shortlist.some(d => d.userId._id === developer.userId._id);
      
      if (isShortlisted) {
        // Remove from shortlist
        // await fetch(`http://localhost:5000/api/shortlist/${developer.userId._id}`, {
        //   method: 'DELETE',
        //   headers: { 'Authorization': `Bearer ${user.token}` }
        // });
        
        setShortlist(shortlist.filter(d => d.userId._id !== developer.userId._id));
        setSuccess('Removed from shortlist');
        setStats(prev => ({ ...prev, shortlisted: prev.shortlisted - 1 }));
      } else {
        // Add to shortlist
        // await fetch('http://localhost:5000/api/shortlist', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${user.token}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ developerId: developer.userId._id })
        // });
        
        setShortlist([...shortlist, developer]);
        setSuccess('Added to shortlist!');
        setStats(prev => ({ ...prev, shortlisted: prev.shortlisted + 1 }));
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update shortlist');
      setTimeout(() => setError(''), 3000);
    }
  };

  const isShortlisted = (developerId) => {
    return shortlist.some(d => d.userId._id === developerId);
  };

  const DeveloperCard = ({ developer, showActions = true }) => {
    const expanded = expandedProfile === developer.userId._id;
    const shortlisted = isShortlisted(developer.userId._id);

    return (
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {developer.userId.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{developer.userId.name}</h3>
                <p className="text-sm text-slate-400">{developer.userId.email}</p>
              </div>
            </div>
            {showActions && (
              <Button
                onClick={() => toggleShortlist(developer)}
                variant="ghost"
                size="sm"
                className={shortlisted ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-400 hover:text-white'}
              >
                {shortlisted ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
              </Button>
            )}
          </div>

          {/* Bio */}
          <p className="text-slate-300 text-sm mb-4">{developer.bio}</p>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{developer.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Briefcase className="w-4 h-4" />
              <span>{developer.experience}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {developer.skills.slice(0, expanded ? undefined : 4).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  {skill}
                </span>
              ))}
              {!expanded && developer.skills.length > 4 && (
                <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs">
                  +{developer.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Award className="w-4 h-4 text-slate-400" />
                <span>{developer.education}</span>
              </div>
              {developer.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{developer.phone}</span>
                </div>
              )}
              {developer.linkedin && (
                <div className="flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4 text-slate-400" />
                  <a href={`https://${developer.linkedin}`} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {developer.github && (
                <div className="flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4 text-slate-400" />
                  <a href={`https://${developer.github}`} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setExpandedProfile(expanded ? null : developer.userId._id)}
              variant="outline"
              size="sm"
              className="flex-1 bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  View Full Profile
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">DevHire</h1>
            <p className="text-sm text-slate-400">Recruiter Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30">
            <AlertDescription className="text-green-400">✓ {success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Total Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
              <p className="text-xs text-slate-500 mt-1">In database</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Shortlisted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-400">{stats.shortlisted}</p>
              <p className="text-xs text-slate-500 mt-1">Saved candidates</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">{stats.searched}</p>
              <p className="text-xs text-slate-500 mt-1">This session</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('search')}
            variant={activeTab === 'search' ? 'default' : 'outline'}
            className={activeTab === 'search' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
          >
            <Search className="w-4 h-4 mr-2" />
            Search Developers
          </Button>
          <Button
            onClick={() => setActiveTab('shortlist')}
            variant={activeTab === 'shortlist' ? 'default' : 'outline'}
            className={activeTab === 'shortlist' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
          >
            <Star className="w-4 h-4 mr-2" />
            My Shortlist ({stats.shortlisted})
          </Button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            {/* Search Bar */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by skills (e.g., React, Node.js, Python)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchDevelopers()}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button
                    onClick={searchDevelopers}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="e.g., Bangalore, Mumbai"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Experience</label>
                      <input
                        type="text"
                        placeholder="e.g., 3 years, 5+ years"
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Results */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Search Results ({developers.length})
              </h3>
              {developers.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No developers found. Try searching with different criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {developers.map((dev) => (
                    <DeveloperCard key={dev.userId._id} developer={dev} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shortlist Tab */}
        {activeTab === 'shortlist' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              My Shortlist ({shortlist.length})
            </h3>
            {shortlist.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-2">Your shortlist is empty</p>
                  <p className="text-sm text-slate-500">Search for developers and click the star icon to add them here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {shortlist.map((dev) => (
                  <DeveloperCard key={dev.userId._id} developer={dev} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterSearchDashboard;