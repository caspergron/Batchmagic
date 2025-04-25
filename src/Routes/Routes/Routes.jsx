import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../../Layouts/DashboardLayout';
import Main from '../../Layouts/Main';
import DashboardHome from '../../Pages/Dashboard/DashboardHome/DashboardHome';
import OutgoingBatches from '../../Pages/Dashboard/OutgoingBatch/Index';
import Supplier from '../../Pages/Dashboard/Supplier/Index';
import Home from '../../Pages/Home/Home/Home';
import NotFound from '../../Pages/NotFound/NotFound';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import Customers from '../../Pages/Dashboard/Customer/Index';
import Shipments from '../../Pages/Dashboard/Shipment/Index';
import Products from '../../Pages/Dashboard/Product';
import ResetPassword from '../../Pages/Home/ResetPassword/ResetPassword';
import MixRecipes from '../../Pages/Dashboard/MixRecipes/index';
import Users from '../../Pages/Dashboard/UserManagement';
import PermissionGuard from '../../components/PermissionGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/password-reset/:id', element: <ResetPassword /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardHome /> },
      {
        path: '/dashboard/supplier/*',
        element: (
          <PermissionGuard permission="suppliers">
            <Supplier />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/product/*',
        element: (
          <PermissionGuard permission="products">
            <Products />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/outgoing-batch/*',
        element: (
          <PermissionGuard permission="batches">
            <OutgoingBatches />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/customers/*',
        element: (
          <PermissionGuard permission="customers">
            <Customers />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/orders/*',
        element: (
          <PermissionGuard permission="orders">
            <Shipments />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/mix-recipes/*',
        element: (
          <PermissionGuard permission="recipes">
            <MixRecipes />
          </PermissionGuard>
        )
      },
      {
        path: '/dashboard/user-management/*',
        element: (
          <PermissionGuard permission="user_management">
            <Users />
          </PermissionGuard>
        )
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;