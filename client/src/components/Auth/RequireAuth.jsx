// src/components/RequireAuth.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const authenticated = isLoggedIn || !!user;

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
