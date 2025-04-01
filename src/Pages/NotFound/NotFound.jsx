import React from 'react';
import { Link } from 'react-router-dom';
import notFound from '../../assets/Logo/404.svg';

const NotFound = () => {
  return (
    <div>
      <div className="containter d-flex justify-content-center">
        <div></div>
        <div>
          <img src={notFound} className="m-5" alt="" />
        </div>
      </div>

      <div className="containter d-flex justify-content-center">
        <div></div>
        <Link className="btn btn-orange text-center" to="/dashboard">
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
