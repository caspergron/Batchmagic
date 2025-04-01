import React from 'react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import './DataTablesStock.css';
import PropTypes from 'prop-types';
import { isEmpty } from '../../../../../components/utils.jsx';
import Loader from '../../../../../components/Loader.jsx';
import SearchBar from '../../../../../components/SearchBarNew.jsx';
import { Link } from 'react-router-dom';
// import SearchList from './SearchList.jsx';

const tableCustomStyles = {
  table: {
    style: {
      minHeight: 'maxContent',
    },
  },
  headCells: {
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      justifyContent: 'left',
      color: '#FFAD05',
      paddingLeft: '36px',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
      wordBreak: 'break-word',
      justifyContent: 'left',
      paddingLeft: '36px',
    },
    draggingStyle: {},
  },
};

const DataTables = ({
  columns,
  data,
  header,
  navigation,
  searchPlaceholder,
  searchBar = true,
  onSort, // Accept the sort handler
  onChangeRowsPerPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState();

  useEffect(() => {
    setRows(data);
  }, [data]);

  useEffect(() => {
    if (rows) {
      setPending(false);
    }
  }, [rows]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredRows([]);
    } else {
      const filteredData = rows.filter((row) => {
        const propertiesToSearch = [
          'name',
          'outgoing_batch_code',
          'ingoing_batch_number',
        ];
        for (const property of propertiesToSearch) {
          if (
            row[property] &&
            row[property].toLowerCase().includes(query.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      setFilteredRows(filteredData);
    }
  };

  return (
    <div>
      <div className="container list-container" style={{ maxWidth: 1600 }}>
        {
          <DataTable
            columns={columns}
            data={filteredRows.length > 0 ? filteredRows : rows}
            direction="ltr"
            fixedHeaderScrollHeight="400px"
            noDataComponent={<Loader />}
            highlightOnHover
            pagination
            progressPending={pending}
            progressComponent={<Loader />}
            responsive
            striped
            subHeader
            onChangeRowsPerPage={onChangeRowsPerPage}
            paginationRowsPerPageOptions={[50, 100, 150, 200]}
            paginationPerPage={50}
            onSort={onSort}
            subHeaderComponent={
              !isEmpty(rows) &&
              searchBar && (
                <div className="list-subheader">
                  <div className="search">
                    <SearchBar
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      handleSearch={handleSearch}
                      placeholder={searchPlaceholder}
                    />
                  </div>
                  <div id="toogle-add-btn" className="">
                    <Link to={navigation}>
                      <button type="button" className="btn list-add-btn">
                        Add {header}
                      </button>
                    </Link>
                  </div>
                </div>
              )
            }
            subHeaderAlign="center"
            customStyles={tableCustomStyles}
          />
        }
      </div>
    </div>
  );
};

DataTables.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  header: PropTypes.string,
  navigation: PropTypes.string,
  searchPlaceholder: PropTypes.string.isRequired,
  searchBar: PropTypes.bool,
  onSort: PropTypes.func, // Add the onSort prop
  onChangeRowsPerPage: PropTypes.func,
};

export default DataTables;
