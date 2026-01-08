import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">DevHire</h1>
          <div className="space-x-3">
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:text-white"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Connect Developers <br />
          <span className="text-blue-500">With Dream Jobs</span>
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          The modern platform where talent meets opportunity. 
          Built for developers who code and recruiters who care.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="text-blue-500 text-3xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-white mb-2">For Recruiters</h3>
          <p className="text-slate-400">Find verified developers with proven skills and real portfolios</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="text-blue-500 text-3xl mb-4">👨‍💻</div>
          <h3 className="text-xl font-semibold text-white mb-2">For Developers</h3>
          <p className="text-slate-400">Showcase your work and get discovered by top companies</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="text-blue-500 text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-white mb-2">Fast & Simple</h3>
          <p className="text-slate-400">No complexity. Just talent meeting opportunity.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;