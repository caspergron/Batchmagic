import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DashboardNavigation = ({ buttons }) => {
  return (
    <div className="dashboardNavigation ">
      <div className="container">
        {buttons.map((button, index) => {
          return (
            <Link key={button.link} to={button.link}>
              <button
                className={`btn btn-orange + ${button?.class}`}
                key={index}
              >
                {button.name}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

DashboardNavigation.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string,
    }),
  ).isRequired,
};

export default DashboardNavigation;
