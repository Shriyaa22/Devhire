
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { api } from '../services/api';

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Prevent multiple submissions
//     if (loading) return;
    
//     setError('');
//     setLoading(true);
    
//     console.log('🚀 Attempting login with:', { email: formData.email });
    
//     try {
//       const response = await api.post('/auth/login', {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password
//       });
      
//       console.log('✅ Login successful:', response.data);
      
//       // Store token and user data
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
      
//       // Redirect based on role
//       if (response.data.user.role === 'developer') {
//         navigate('/developer/dashboard');
//       } else {
//         navigate('/recruiter/dashboard');
//       }
      
//     } catch (err) {
//       console.error('❌ Login failed:', err);
      
//       if (err.response) {
//         // Server responded with error
//         const errorMessage = err.response.data?.error || 'Login failed';
//         setError(errorMessage);
//         console.log('Server error:', err.response.status, errorMessage);
        
//         // If user not found, suggest signup
//         if (err.response.status === 401) {
//           setError('Invalid credentials. Please check your email and password, or sign up if you don\'t have an account.');
//         }
//       } else if (err.request) {
//         // Request made but no response
//         setError('Cannot connect to server. Is it running on port 5000?');
//         console.error('No response from server');
//       } else {
//         // Something else happened
//         setError('An unexpected error occurred');
//         console.error('Error:', err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
//       <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
//           <CardDescription className="text-slate-400">
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-slate-300">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="bg-slate-900 border-slate-700 text-white"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-slate-300">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 className="bg-slate-900 border-slate-700 text-white"
//               />
//             </div>

//             {error && (
//               <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
//                 <p className="text-sm text-red-400">{error}</p>
//               </div>
//             )}

//             <Button 
//               type="submit" 
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>

//           <div className="mt-6 text-center text-sm text-slate-400">
//             Don't have an account?{' '}
//             <button
//               onClick={() => navigate('/signup')}
//               className="text-blue-500 hover:text-blue-400 font-medium"
//               type="button"
//             >
//               Sign up
//             </button>
//           </div>

//           <div className="mt-4 text-center">
//             <button
//               onClick={() => navigate('/')}
//               className="text-sm text-slate-500 hover:text-slate-400"
//               type="button"
//             >
//               ← Back to home
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Login;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    console.log('🚀 Attempting login with:', { email: formData.email });
    
    try {
      const response = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      console.log('✅ Login successful:', response.data);
      
      // Use AuthContext login (handles storage + redirect)
      login(response.data.user, response.data.token);
      
    } catch (err) {
      console.error('❌ Login failed:', err);
      
      if (err.response) {
        const errorMessage = err.response.data?.error || 'Login failed';
        setError(errorMessage);
        console.log('Server error:', err.response.status, errorMessage);
        
        if (err.response.status === 401) {
          setError('Invalid credentials. Please check your email and password, or sign up if you don\'t have an account.');
        }
      } else if (err.request) {
        setError('Cannot connect to server. Is it running on port 5000?');
        console.error('No response from server');
      } else {
        setError('An unexpected error occurred');
        console.error('Error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-500 hover:text-blue-400 font-medium"
              type="button"
            >
              Sign up
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-slate-500 hover:text-slate-400"
              type="button"
            >
              ← Back to home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

