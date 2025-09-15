/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userdetails } = useAuth();
  const userRole = userdetails ? userdetails.Role : null;

  useEffect(() => {
    if (!isLoggedIn || (allowedRoles && !allowedRoles.includes(userRole))) {
      navigate('/');
    }
  }, [isLoggedIn, allowedRoles, userRole, navigate]);

  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
