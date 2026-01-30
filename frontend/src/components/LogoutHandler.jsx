import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to the rental website
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
        <p className="text-sky-700 font-semibold">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutHandler; 