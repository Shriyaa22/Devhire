

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// Protected Pages - Developer
import DeveloperDashboard from '../pages/developer/DeveloperDashboard';
import DeveloperProfile from '../pages/developer/DeveloperProfile'
// Protected Pages - Recruiter
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Developer Routes */}
          <Route 
            path="/developer/dashboard" 
            element={
              <ProtectedRoute role="developer">
                <DeveloperDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/developer/profile"
            element={
              <ProtectedRoute role="developer">
                <DeveloperProfile />
              </ProtectedRoute>
            } 
          />


          {/* Protected Recruiter Routes */}
          <Route 
            path="/recruiter/dashboard" 
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/recruiter/profile"
            />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;