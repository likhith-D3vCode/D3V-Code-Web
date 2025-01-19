// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import BACKEND_URL from '../config';

import axios from 'axios';
import { useState,useEffect } from "react";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const tokenauth = localStorage.getItem('authToken');
      try {
        const response = await axios.get(`${BACKEND_URL}/auth/validate-token`, {
          headers: {
            Authorization: `Bearer ${tokenauth}`, // Include the token in the Authorization header
          },
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Optionally show a loading indicator
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/StaticLogin" />;
};

ProtectedRoute.propTypes={
    element:PropTypes.node.isRequired,
}

export default ProtectedRoute;
