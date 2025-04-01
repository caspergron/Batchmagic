import PropTypes from 'prop-types';
import './DataTable.css';
import React from 'react';

function SearchBar({
  searchExpanded,
  setSearchExpanded,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) {
  return (
    <div className="d-flex flex-row-reverse">
      <button
        className={`btn ${
          searchExpanded ? 'btn-danger' : 'bg-purple'
        } rounded-circle search-bar m-3`}
        onClick={() => setSearchExpanded(!searchExpanded)}
      >
        {searchExpanded ? (
          <i
            className="fas fa-times"
            style={{
              height: '16px',
              width: '16px',
            }}
          ></i>
        ) : (
          <i
            className="fas fa-search"
            style={{
              height: '16px',
              width: '16px',
            }}
          ></i>
        )}
      </button>
      {searchExpanded && (
        <input
          type="text"
          value={searchQuery}
          className={`form-control ${searchExpanded ? 'search-expanded' : ''}`}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search"
        />
      )}
    </div>
  );
}

SearchBar.propTypes = {
  searchExpanded: PropTypes.bool.isRequired,
  setSearchExpanded: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchBar;
