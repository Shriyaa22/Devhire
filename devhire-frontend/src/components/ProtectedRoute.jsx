import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Protects routes from unauthorized access and enforces role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string} props.role - Required role to access this route (optional)
 * @param {string} props.redirectTo - Where to redirect if unauthorized (default: '/login')
 */
const ProtectedRoute = ({ children, role, redirectTo = '/login' }) => {
  const { isAuthenticated, hasRole, getUserRole, user } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('🚫 Access denied: User not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // If a specific role is required, check if user has that role
  if (role && !hasRole(role)) {
    const currentRole = getUserRole();
    console.log(`🚫 Access denied: User role "${currentRole}" cannot access "${role}" route`);
    
    // Redirect to user's appropriate dashboard
    if (currentRole === 'developer') {
      return <Navigate to="/developer/dashboard" replace />;
    } else if (currentRole === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has correct role
  console.log(`✅ Access granted: ${user?.name} (${getUserRole()}) accessing protected route`);
  return children;
};

export default ProtectedRoute;