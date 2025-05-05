import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isTokenExpired from '../isTokenExpired';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || isTokenExpired(token)) {
      localStorage.clear(); 
      navigate('/signin');
    } else {
      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'Manager') {
        navigate('/manager-dashboard');
      } else if (role === 'User') {
        navigate('/user-dashboard');
      } else {
        navigate('/signin');
      }
    }
  }, [navigate]);
  return null; 
};

export default Dashboard;