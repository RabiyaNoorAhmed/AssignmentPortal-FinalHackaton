// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const ProtectedRoute = ({ element, role, ...rest }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser || currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
