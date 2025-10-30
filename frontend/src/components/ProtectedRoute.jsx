import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  // For testing purposes, also check for test user data
  const testUser = localStorage.getItem('testUser');
  
  if (!token && !testUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
