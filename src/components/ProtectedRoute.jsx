import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../isTokenExpired';

const ProtectedRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token || storedRole !== role || isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;