import React from 'react'; // Add this line to import React
import './DashboardHome.css';
import incomingproduct from '../../../assets/Logo/incomingproduct.svg';
import externallink from '../../../assets/Logo/externallink.svg';
import suppliers from '../../../assets/Logo/suppliers.svg';
import customers from '../../../assets/Logo/customers.svg';
import shipment from '../../../assets/Logo/shipment.svg';
import recipe from '../../../assets/Logo/recipe.svg';
import User from '../User/User';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  return (
    <div className="container">
      <h3 className="heading-text my-4">
        Here you can create and track your outgoing batches
      </h3>
      <User />
      <div>
        <div className="row row-cols-2">
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard">
                    Incoming Products
                  </h5>
                  <img
                    className="dashboard-logo"
                    src={incomingproduct}
                    alt=""
                  />
                </div>
                <Link to="/dashboard/product">
                  {' '}
                  <button className="dashboard-button">View</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard">Batches</h5>
                  <img className="dashboard-logo" src={externallink} alt="" />
                </div>
                <Link to="/dashboard/outgoing-batch">
                  <button className="dashboard-button">View</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard">Suppliers</h5>
                  <img className="dashboard-logo" src={suppliers} alt="" />
                </div>
                <Link to="/dashboard/supplier">
                  <button className="dashboard-button">View</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard">Customers</h5>
                  <img className="dashboard-logo" src={customers} alt="" />
                </div>
                <Link to="/dashboard/customers">
                  <button className="dashboard-button">View</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard mb-5">
                    Outgoing Orders
                  </h5>
                  <img className="dashboard-logo" src={shipment} alt="" />
                </div>
                <Link to="/dashboard/orders">
                  <button className="dashboard-button my-3">View</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <div className="card card-dashboard">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title card-text-dashboard mb-5">
                    Mix Recipies
                  </h5>
                  <img className="dashboard-logo" src={recipe} alt="" />
                </div>
                <Link to="/dashboard/mix-recipes">
                  <button className="dashboard-button my-3">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
