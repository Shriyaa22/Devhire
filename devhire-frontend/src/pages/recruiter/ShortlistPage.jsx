import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getShortlist, removeFromShortlist } from '../../services/searchService';

function ShortlistPage() {
  const navigate = useNavigate();
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getShortlist();
      setShortlist(data.shortlist);
    } catch (err) {
      setError('Failed to load shortlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (developerId) => {
    if (!confirm('Remove this developer from your shortlist?')) return;

    try {
      await removeFromShortlist(developerId);
      // Remove from local state
      setShortlist(shortlist.filter(item => 
        item.profile?.userId._id !== developerId
      ));
      alert('Removed from shortlist');
    } catch (err) {
      alert('Failed to remove from shortlist');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/recruiter/developer/${userId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
          <h1 className="text-xl font-bold text-white">My Shortlist</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Header with Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Saved Candidates
          </h2>
          <p className="text-slate-400">
            {loading ? 'Loading...' : `${shortlist.length} developer${shortlist.length !== 1 ? 's' : ''} in your shortlist`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading shortlist...</div>
          </div>
        ) : shortlist.length === 0 ? (
          /* Empty State */
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No candidates in shortlist
              </h3>
              <p className="text-slate-400 mb-6">
                Start searching for developers and add them to your shortlist
              </p>
              <Button 
                onClick={() => navigate('/recruiter/search')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Search Developers
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Shortlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.map((item) => {
              const profile = item.profile;
              if (!profile) return null;

              return (
                <Card key={item.shortlistId} className="bg-slate-800/50 border-slate-700 hover:border-yellow-500 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">
                          {profile.userId?.name || 'Anonymous'}
                        </CardTitle>
                        <p className="text-blue-400 text-sm">{profile.title || 'Developer'}</p>
                      </div>
                      <span className="text-yellow-400 text-xl">⭐</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Added Date */}
                    <p className="text-slate-500 text-xs mb-3">
                      Added {formatDate(item.createdAt)}
                    </p>

                    {/* Location */}
                    {profile.location && (
                      <p className="text-slate-400 text-sm mb-3">
                        📍 {profile.location}
                      </p>
                    )}

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {/* Skills */}
                    <div className="mb-3">
                      <p className="text-slate-400 text-xs mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills && profile.skills.slice(0, 4).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skills && profile.skills.length > 4 && (
                          <span className="text-slate-500 text-xs px-2 py-1">
                            +{profile.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mb-3 p-2 bg-slate-900 rounded">
                        <p className="text-slate-400 text-xs mb-1">Notes:</p>
                        <p className="text-slate-300 text-sm">{item.notes}</p>
                      </div>
                    )}

                    {/* Profile Completion */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Profile</span>
                        <span className="text-blue-400">{profile.profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{width: `${profile.profileCompletion}%`}}
                        ></div>
                      </div>
                    </div>

                    {/* Availability Badge */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        profile.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                        profile.availability === 'open-to-offers' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {profile.availability === 'available' ? '✓ Available' :
                         profile.availability === 'open-to-offers' ? '● Open to Offers' :
                         '✗ Not Available'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewProfile(profile.userId._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        View Profile
                      </Button>
                      <Button 
                        onClick={() => handleRemove(profile.userId._id)}
                        variant="outline"
                        className="bg-red-600 text-white hover:bg-red-700"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShortlistPage;