// import { useAuth } from '../../context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// function RecruiterDashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Header/Navbar */}
//       <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-white">DevHire</h1>
//             <p className="text-sm text-slate-400">Recruiter Portal</p>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-white font-medium">{user?.name}</p>
//               <p className="text-xs text-slate-400">{user?.email}</p>
//             </div>
//             <Button 
//               onClick={logout}
//               variant="outline"
//               className="bg-slate-700 text-white hover:bg-slate-600"
//             >
//               Logout
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">
//             Welcome back, {user?.name}! 👋
//           </h2>
//           <p className="text-slate-400">
//             Find and connect with talented developers
//           </p>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card className="bg-slate-800/50 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white text-sm">Total Searches</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-blue-400">0</p>
//               <p className="text-xs text-slate-500 mt-1">This month</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-800/50 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white text-sm">Shortlisted</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-green-400">0</p>
//               <p className="text-xs text-slate-500 mt-1">Candidates</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-800/50 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white text-sm">Interviews</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-purple-400">0</p>
//               <p className="text-xs text-slate-500 mt-1">Scheduled</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-800/50 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-white text-sm">Messages</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-bold text-orange-400">0</p>
//               <p className="text-xs text-slate-500 mt-1">Unread</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Recent Activity */}
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
//           <Card className="bg-slate-800/50 border-slate-700">
//             <CardContent className="py-8">
//               <div className="text-center text-slate-400">
//                 <p className="text-lg">No recent activity</p>
//                 <p className="text-sm mt-2">Start searching for developers to see activity here</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button 
//               className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
//               disabled
//             >
//               <div className="text-left w-full">
//                 <p className="font-semibold">Search Developers</p>
//                 <p className="text-xs opacity-80">Find candidates by skills</p>
//               </div>
//             </Button>
//             <Button 
//               className="bg-green-600 hover:bg-green-700 h-auto py-4"
//               disabled
//             >
//               <div className="text-left w-full">
//                 <p className="font-semibold">View Shortlist</p>
//                 <p className="text-xs opacity-80">Review saved candidates</p>
//               </div>
//             </Button>
//             <Button 
//               className="bg-purple-600 hover:bg-purple-700 h-auto py-4"
//               disabled
//             >
//               <div className="text-left w-full">
//                 <p className="font-semibold">Schedule Interview</p>
//                 <p className="text-xs opacity-80">Set up meetings</p>
//               </div>
//             </Button>
//           </div>
//         </div>

//         {/* Status Message */}
//         <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
//           <p className="text-green-400 text-sm">
//             🚀 <strong>Recruiter Dashboard Active!</strong> This is a placeholder. Full features coming soon.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RecruiterDashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSearchStats } from '../../services/searchService';

function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalDevelopers: 0,
    availableDevelopers: 0,
    completedProfiles: 0,
    topSkills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getSearchStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            <p className="text-sm text-slate-400">Recruiter Portal</p>
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
            Find and connect with talented developers
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Total Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-400">
                {loading ? '...' : stats.totalDevelopers}
              </p>
              <p className="text-xs text-slate-500 mt-1">On platform</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">
                {loading ? '...' : stats.availableDevelopers}
              </p>
              <p className="text-xs text-slate-500 mt-1">Currently available</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Complete Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-400">
                {loading ? '...' : stats.completedProfiles}
              </p>
              <p className="text-xs text-slate-500 mt-1">100% completion</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Top Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-400">
                {loading ? '...' : stats.topSkills.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Different skills</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-8">
              <div className="text-center text-slate-400">
                <p className="text-lg">No recent activity</p>
                <p className="text-sm mt-2">Start searching for developers to see activity here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 h-auto py-4"
              onClick={() => navigate('/recruiter/search')}
            >
              <div className="text-left w-full">
                <p className="font-semibold">Search Developers</p>
                <p className="text-xs opacity-80">Find candidates by skills</p>
              </div>
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 h-auto py-4"
              onClick={() => navigate('/recruiter/shortlist')}
            >
              <div className="text-left w-full">
                <p className="font-semibold">View Shortlist</p>
                <p className="text-xs opacity-80">Review saved candidates</p>
              </div>
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 h-auto py-4"
              disabled
            >
              <div className="text-left w-full">
                <p className="font-semibold">Schedule Interview</p>
                <p className="text-xs opacity-80">Set up meetings</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm">
            🚀 <strong>Recruiter Dashboard Active!</strong> Search for developers and build your shortlist.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;