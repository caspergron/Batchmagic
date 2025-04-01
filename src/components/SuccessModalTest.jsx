import React from 'react';
import PropTypes from 'prop-types';
import close from '../assets/Logo/actions/cross.svg';
import success from '../assets/Logo/success.svg';

const SuccessModalTest = ({ closeModal }) => {
  return (
    <div>
      <div className="d-flex flex-column product-modal-content">
        <div className="align-self-end content-first">
          <img
            className="align-self-end cross-sign"
            onClick={closeModal}
            src={close}
            alt=""
          />
        </div>
        <div className="d-flex flex-column content-two">
          <div className="d-flex justify-content-center success-container">
            <img className=" success-sign" src={success} alt="success" />
          </div>
          <div className="align-self-center d-flex flex-column align-items-center content-two-text">
            <h1>Great</h1>
            <p>Product has been added successfully</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessModalTest.propTypes = {
  closeModal: PropTypes.function,
};

export default SuccessModalTest;
