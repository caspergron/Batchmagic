import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';
import Sidebar from './Sidebar/Sidebar';
import './Sidebar/Sidebar.css';

import { useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();

  // Check if the current route ends with "/dashboard" or "/dashboard/"
  const hideSidebar =
    location.pathname.endsWith('/dashboard') ||
    location.pathname.endsWith('/dashboard/');

  return (
    <div>
      <Navbar></Navbar>
      <div className="recipe-content">
        {!hideSidebar && (
          <div className="recipe-sidebar">
            <Sidebar />
          </div>
        )}

        <div className="recipe-component">
          {loading && (
            <div className="d-flex justify-content-center align-items-center">
              <Loader />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
