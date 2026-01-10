import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          console.log('✅ User restored from localStorage:', JSON.parse(storedUser));
        } else {
          console.log('ℹ️ No stored authentication found');
        }
      } catch (error) {
        console.error('❌ Error loading auth from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData, authToken) => {
    try {
      // Store in state
      setUser(userData);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Login successful:', userData);

      // Redirect based on role
      if (userData.role === 'developer') {
        navigate('/developer/dashboard');
      } else if (userData.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/'); // fallback
      }
    } catch (error) {
      console.error('❌ Login error:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear state
      setUser(null);
      setToken(null);

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      console.log('✅ Logout successful');

      // Redirect to home or login
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getUserRole
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};