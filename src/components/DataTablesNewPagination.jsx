import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import './DataTablesNew.css';
import PropTypes from 'prop-types';
import Loader from './Loader.jsx';
import SearchBar from './SearchBarNew.jsx';
import { Link } from 'react-router-dom';

const tableCustomStyles = {
  table: {
    style: { minHeight: 'maxContent' },
  },
  headCells: {
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      justifyContent: 'left',
      color: '#FFAD05',
      cursor: 'pointer',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
      justifyContent: 'left',
      whiteSpace: 'normal', // Allow text to wrap
      wordBreak: 'break-word', // Ensure long words break and don't overflow
      overflow: 'visible', // Allow overflow text to be visible
      maxWidth: '200px', // Control column width
      padding: '16px 20px', // Add more padding if needed
    },
  },
  rows: {
    style: {
      minHeight: '50px', // Ensure rows have sufficient height
    },
  },
};





const DataTablesPagination = ({
  columns,
  data,
  meta,
  header,
  navigation,
  searchPlaceholder,
  searchBar = true,
  setSearchQuery,
  setSortColumn,
  setSortDirection,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setPending(false);
  }, [data]);

  const handleSearch = (query) => {
    setSearchValue(query);
    setSearchQuery(query); // Controlled search query
    onPageChange(1); // Reset to page 1 when searching
  };

  const handleSort = (column) => {
    if (!column.selector) return;

    setSortColumn('name'); // Set the column being sorted
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <div className="container list-container" style={{ maxWidth: 1600 }}>
        <DataTable
          columns={columns}
          data={data}
          direction="ltr"
          fixedHeaderScrollHeight="400px"
          noDataComponent="No Data Found"
          highlightOnHover
          progressPending={pending}
          progressComponent={<Loader />}
          responsive
          striped
          subHeader
          customStyles={tableCustomStyles}
          onSort={(column, sortDirection) => handleSort(column, sortDirection)} // Sorting handler
          sortServer
          subHeaderComponent={
            searchBar && (
              <div className="list-subheader">
                <div className="search">
                  <SearchBar
                    searchQuery={searchValue}
                    setSearchQuery={setSearchValue}
                    handleSearch={handleSearch}
                    placeholder={searchPlaceholder}
                  />
                </div>
                <div id="toggle-add-btn" className="">
                  <Link to={navigation}>
                    <button type="button" className="btn list-add-btn">
                      Add {header}
                    </button>
                  </Link>
                </div>
              </div>
            )
          }
        />

        {/* Meta-Based Pagination Controls */}
        {meta && (
          <div className="custom-pagination">
            <button
              onClick={() => onPageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
            >
              Previous
            </button>

            <span>
              Page {meta.current_page} of {Math.ceil(meta.total / meta.per_page)}
            </span>

            <button
              onClick={() => onPageChange(meta.current_page + 1)}
              disabled={meta.current_page === Math.ceil(meta.total / meta.per_page)}
            >
              Next
            </button>

            <select
              value={meta.per_page}
              onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <span>Total Rows: {meta.total}</span>
            <span>Total Quantity: {meta.total_quantity}</span>
          </div>
        )}
      </div>
    </div>
  );
};

DataTablesPagination.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  meta: PropTypes.object.isRequired,
  header: PropTypes.string,
  navigation: PropTypes.string,
  searchPlaceholder: PropTypes.string.isRequired,
  searchBar: PropTypes.bool,
  setSearchQuery: PropTypes.func.isRequired,
  setSortColumn: PropTypes.func.isRequired,
  setSortDirection: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

export default DataTablesPagination;
