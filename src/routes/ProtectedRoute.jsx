import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ redirectTo = '/auth' }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
