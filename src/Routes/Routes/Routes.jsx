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
        {' '}
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardHome /> },
      { path: '/dashboard/supplier/*', element: <Supplier /> },
      { path: '/dashboard/product/*', element: <Products /> },
      { path: '/dashboard/outgoing-batch/*', element: <OutgoingBatches /> },
      { path: '/dashboard/customers/*', element: <Customers /> },
      { path: '/dashboard/orders/*', element: <Shipments /> },
      { path: '/dashboard/mix-recipes/*', element: <MixRecipes /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
