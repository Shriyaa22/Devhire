import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDeveloperProfile, addToShortlist, checkShortlist, removeFromShortlist } from '../../services/searchService';

function DeveloperProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    checkIfShortlisted();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getDeveloperProfile(userId);
      setProfile(data.profile);
    } catch (err) {
      setError('Failed to load developer profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfShortlisted = async () => {
    try {
      const data = await checkShortlist(userId);
      setIsShortlisted(data.isShortlisted);
    } catch (err) {
      console.error('Error checking shortlist:', err);
    }
  };

  const handleShortlistToggle = async () => {
    try {
      setActionLoading(true);
      
      if (isShortlisted) {
        await removeFromShortlist(userId);
        setIsShortlisted(false);
        alert('Removed from shortlist');
      } else {
        await addToShortlist(userId);
        setIsShortlisted(true);
        alert('Added to shortlist!');
      }
    } catch (err) {
      alert('Failed to update shortlist');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 p-8">
          <p className="text-red-400 text-lg">{error || 'Profile not found'}</p>
          <Button 
            onClick={() => navigate('/recruiter/search')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Back to Search
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button 
            onClick={() => navigate('/recruiter/search')}
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            ← Back to Search
          </Button>
          <Button 
            onClick={handleShortlistToggle}
            disabled={actionLoading}
            className={isShortlisted ? 
              "bg-yellow-600 hover:bg-yellow-700" : 
              "bg-blue-600 hover:bg-blue-700"
            }
          >
            {actionLoading ? 'Loading...' : isShortlisted ? '⭐ Shortlisted' : '⭐ Add to Shortlist'}
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.userId?.name || 'Anonymous Developer'}
                </h1>
                <p className="text-xl text-blue-400 mb-2">{profile.title || 'Developer'}</p>
                {profile.location && (
                  <p className="text-slate-400">📍 {profile.location}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  profile.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                  profile.availability === 'open-to-offers' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {profile.availability === 'available' ? '✓ Available' :
                   profile.availability === 'open-to-offers' ? '● Open to Offers' :
                   '✗ Not Available'}
                </span>
                <p className="text-slate-400 text-sm mt-2">
                  Profile {profile.profileCompletion}% Complete
                </p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6">
                <p className="text-slate-300">{profile.bio}</p>
              </div>
            )}

            {/* Contact */}
            <div className="mt-4 flex items-center gap-4">
              <p className="text-slate-400">
                📧 {profile.userId?.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Skills & Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No skills listed</p>
            )}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.experience && profile.experience.length > 0 ? (
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="text-white font-semibold text-lg">{exp.position}</h3>
                    <p className="text-blue-400">{exp.company}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="text-slate-300 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No experience listed</p>
            )}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((project, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            🔗 Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            💻 GitHub
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No projects listed</p>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-purple-500 pl-4">
                    <h3 className="text-white font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="text-purple-400">{edu.institution}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {profile.socialLinks.github && (
                  <a 
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    💻 GitHub
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a 
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    💼 LinkedIn
                  </a>
                )}
                {profile.socialLinks.portfolio && (
                  <a 
                    href={profile.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    🌐 Portfolio
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a 
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    🐦 Twitter
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DeveloperProfileView;