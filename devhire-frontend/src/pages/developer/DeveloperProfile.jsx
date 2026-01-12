import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, updateProfile, addSkills, removeSkill } from '../../services/profileService';

function DeveloperProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    bio: '',
    location: '',
    availability: 'available'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data.profile);
      
      // Populate form with existing data
      setBasicInfo({
        title: data.profile.title || '',
        bio: data.profile.bio || '',
        location: data.profile.location || '',
        availability: data.profile.availability || 'available'
      });
      
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBasicInfo = async () => {
    try {
      setError('');
      const data = await updateProfile(basicInfo);
      setProfile(data.profile);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    
    try {
      setAddingSkill(true);
      const data = await addSkills([newSkill.trim()]);
      
      // Update profile with new skills
      setProfile(prev => ({
        ...prev,
        skills: data.skills,
        profileCompletion: data.profileCompletion
      }));
      
      setNewSkill('');
    } catch (err) {
      setError('Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      const data = await removeSkill(skill);
      
      // Update profile
      setProfile(prev => ({
        ...prev,
        skills: data.skills,
        profileCompletion: data.profileCompletion
      }));
    } catch (err) {
      setError('Failed to remove skill');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/developer/dashboard')}
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <h1 className="text-xl font-bold text-white">My Profile</h1>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Profile Completion */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-blue-400 font-medium">{profile?.profileCompletion || 0}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                  style={{width: `${profile?.profileCompletion || 0}%`}}
                ></div>
              </div>
              <p className="text-xs text-slate-500">
                {profile?.profileCompletion === 100 
                  ? '🎉 Your profile is complete!' 
                  : 'Complete your profile to increase visibility to recruiters'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Basic Information</CardTitle>
            <Button 
              onClick={() => editing ? handleUpdateBasicInfo() : setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editing ? 'Save' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div>
                  <Label className="text-slate-300">Professional Title</Label>
                  <Input
                    value={basicInfo.title}
                    onChange={(e) => setBasicInfo({...basicInfo, title: e.target.value})}
                    placeholder="e.g., Full Stack Developer"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Bio</Label>
                  <Textarea
                    value={basicInfo.bio}
                    onChange={(e) => setBasicInfo({...basicInfo, bio: e.target.value})}
                    placeholder="Tell recruiters about yourself..."
                    rows={4}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Location</Label>
                  <Input
                    value={basicInfo.location}
                    onChange={(e) => setBasicInfo({...basicInfo, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Availability</Label>
                  <select
                    value={basicInfo.availability}
                    onChange={(e) => setBasicInfo({...basicInfo, availability: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2"
                  >
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                    <option value="open-to-offers">Open to Offers</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-slate-400">Title</p>
                  <p className="text-white">{profile?.title || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400">Bio</p>
                  <p className="text-white">{profile?.bio || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white">{profile?.location || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Availability</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    profile?.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                    profile?.availability === 'open-to-offers' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {profile?.availability === 'available' ? 'Available' :
                     profile?.availability === 'open-to-offers' ? 'Open to Offers' :
                     'Not Available'}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Skill Input */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill (e.g., React, Python)"
                className="bg-slate-900 border-slate-700 text-white"
                disabled={addingSkill}
              />
              <Button 
                onClick={handleAddSkill}
                disabled={!newSkill.trim() || addingSkill}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {addingSkill ? 'Adding...' : 'Add'}
              </Button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No skills added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Experience Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-center py-4">
              Coming soon... (We'll add this next!)
            </p>
          </CardContent>
        </Card>

        {/* Placeholder for Projects Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-center py-4">
              Coming soon... (We'll add this next!)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DeveloperProfile;