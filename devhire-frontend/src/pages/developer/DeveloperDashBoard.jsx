import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProfile } from '../../services/profileService';

function DeveloperDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileCompletion();
  }, []);

  const fetchProfileCompletion = async () => {
    try {
      const data = await getProfile();
      setProfileCompletion(data.profile.profileCompletion || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header/Navbar */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">DevHire</h1>
            <p className="text-sm text-slate-400">Developer Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="bg-slate-700 text-white hover:bg-slate-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-slate-400">
            Manage your profile, skills, and interview requests
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-blue-400 font-medium">
                    {loading ? '...' : `${profileCompletion}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all" 
                    style={{width: `${profileCompletion}%`}}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Complete your profile to increase visibility
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Interview Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-blue-400">0</p>
                <p className="text-sm text-slate-400 mt-2">Pending requests</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-green-400">0</p>
                <p className="text-sm text-slate-400 mt-2">This week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
              onClick={() => navigate('/developer/profile')}
            >
              <div className="text-left w-full">
                <p className="font-semibold">Complete Your Profile</p>
                <p className="text-xs opacity-80">Add skills, experience, and projects</p>
              </div>
            </Button>
            <Button 
              className="bg-slate-700 hover:bg-slate-600 h-auto py-4"
              disabled
            >
              <div className="text-left w-full">
                <p className="font-semibold">Browse Opportunities</p>
                <p className="text-xs opacity-80">View available positions</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            🚀 <strong>Developer Dashboard Active!</strong> This is a placeholder. Full features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeveloperDashboard;