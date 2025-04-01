import React from 'react';
import PropTypes from 'prop-types';
import './SuccessModal.css';
import success from '../assets/Logo/success.svg';

const SuccessModal = ({ modalText }) => {
  return (
    <div className="modal-dialog modal-dialog-centered d-flex justify-content-center align-items-center modal-success-dialog">
      <div className="modal-content modal-success-content">
        <div className="modal-header">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body d-flex flex-column modal-success-body">
          <div className="d-flex justify-content-center success-sign-container">
            <img className="success-sign" src={success} alt="success" />
          </div>
          <div className="align-self-center d-flex flex-column align-items-center success-content-text">
            <h1>Great</h1>
            <p>{modalText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  modalText: PropTypes.string,
};

export default SuccessModal;
