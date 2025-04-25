import React from 'react';
import './DashboardHome.css';
import incomingproduct from '../../../assets/Logo/incomingproduct.svg';
import externallink from '../../../assets/Logo/externallink.svg';
import suppliers from '../../../assets/Logo/suppliers.svg';
import customers from '../../../assets/Logo/customers.svg';
import shipment from '../../../assets/Logo/shipment.svg';
import recipe from '../../../assets/Logo/recipe.svg';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import NoPermissionMessage from '../../../components/NoPermissionMessage';

const DashboardHome = () => {
  const { hasPermission, loading } = useAuth();

  const dashboardCards = [
    {
      title: 'Incoming Products',
      icon: incomingproduct,
      link: '/dashboard/product',
      permission: 'products'
    },
    {
      title: 'Batches',
      icon: externallink,
      link: '/dashboard/outgoing-batch',
      permission: 'batches'
    },
    {
      title: 'Suppliers',
      icon: suppliers,
      link: '/dashboard/supplier',
      permission: 'suppliers'
    },
    {
      title: 'Customers',
      icon: customers,
      link: '/dashboard/customers',
      permission: 'customers'
    },
    {
      title: 'Outgoing Orders',
      icon: shipment,
      link: '/dashboard/orders',
      permission: 'orders'
    },
    {
      title: 'Mix Recipes',
      icon: recipe,
      link: '/dashboard/mix-recipes',
      permission: 'recipes'
    },
    {
      title: 'User Management',
      icon: suppliers,
      link: '/dashboard/user-management',
      permission: 'user_management'
    }
  ];

  // Filter cards based on user permissions
  const authorizedCards = dashboardCards.filter(card => hasPermission(card.permission));

  return (
    <div className="container">
      <h3 className="heading-text my-4">
        Here you can create and track your outgoing batches
      </h3>
      {!loading && <div>
        <div className="row row-cols-2">

          {!loading && authorizedCards.length == 0 && (
            <NoPermissionMessage />
          )}

          {authorizedCards.map((card, index) => (
            <div className="col my-3" key={index}>
              <div className="card card-dashboard">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title card-text-dashboard">
                      {card.title}
                    </h5>
                    <img
                      className="dashboard-logo"
                      src={card.icon}
                      alt={card.title}
                    />
                  </div>
                  <Link to={card.link}>
                    <button className="dashboard-button">View</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default DashboardHome;