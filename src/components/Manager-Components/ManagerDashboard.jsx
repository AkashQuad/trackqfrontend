import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManagerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const managerId = localStorage.getItem('userId');
    if (managerId) {
      navigate(`/manager-dashboard/${managerId}`, {
        state: {
          username: localStorage.getItem('username') || 'Manager',
        },
      });
    } else {
      navigate('/signin', { state: { error: 'Please login to access the dashboard' } });
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default ManagerDashboard;