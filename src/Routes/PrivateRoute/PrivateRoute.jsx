import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import Navbar from '../../Pages/Shared/Navbar';
import PropTypes from 'prop-types';
const PrivateRoute = ({ children }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <>
        <Navbar></Navbar>
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      </>
    );
  }
  return auth ? (
    children
  ) : (
    <Navigate to={{ pathname: '/', state: { from: location } }} replace />
  );
};
PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default PrivateRoute;
