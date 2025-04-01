import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ErrorModal = ({ value }) => {
  useEffect(() => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }, [value]);

  return <div></div>;
};

ErrorModal.propTypes = {
  value: PropTypes.bool.isRequired,
};

export default ErrorModal;
