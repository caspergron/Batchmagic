import PropTypes from 'prop-types';
import './SearchBarNew.css';
import React from 'react';
import search from '../assets/Logo/actions/search.svg';

function SearchBar({ searchQuery, setSearchQuery, handleSearch, placeholder }) {
  return (
    <div className="search-input-container">
      <input
        type="text"
        value={searchQuery}
        className="form-control input-search input-search-style-added"
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder={placeholder}
      />
      <span className="search-icon search-icon-customized">
        <img src={search} height={20} width={20} />
      </span>
    </div>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default SearchBar;
