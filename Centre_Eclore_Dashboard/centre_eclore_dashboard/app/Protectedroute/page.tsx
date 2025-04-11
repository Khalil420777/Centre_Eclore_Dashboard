"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check both cookie and localStorage
    const token = Cookies.get('token') || localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">
             <p>Chargement...</p>
           </div>;
  }

  return children;
};

export default ProtectedRoute;