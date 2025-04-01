/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import close from './../assets/Logo/actions/cross.svg';

export default function SearchList({ data, setFilteredRows, setSearchQuery }) {
  const handleClose = () => {
    setFilteredRows(data);
    setSearchQuery('');
    document.getElementById('toogle-add-btn').style.visibility = 'visible';
    document.getElementById('toogle-page-close').style.visibility = 'hidden';
  };
  return (
    <div>
      <Link
        // to={navigation}
        onClick={handleClose}
        id="toogle-page-close"
        style={{ visibility: 'hidden' }}
        className="d-flex flex-column"
      >
        <img
          className="align-self-end page-close edit-page-close-position"
          src={close}
          alt=""
        />
      </Link>
    </div>
  );
}

SearchList.propTypes = {
  data: PropTypes.array,
  setFilteredRows: PropTypes.array,
  setSearchQuery: PropTypes.string,
};
