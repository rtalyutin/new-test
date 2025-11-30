import { createElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const PrivateRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return createElement(Navigate, { to: '/auth', replace: true, state: { from: location } });
  }

  return createElement(Outlet);
};

export default PrivateRoute;
