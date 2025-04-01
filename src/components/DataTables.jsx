import React from 'react';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Loader from './Loader';
import SearchBar from './SearchBar';
import './DataTable.css';
import PropTypes from 'prop-types';
import { isEmpty } from './utils';

const DataTables = ({ columns, data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
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
    if (!query && !searchExpanded) {
      setSearchExpanded(false);
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
      <div className="container datatable-custom w-75">
        {
          <DataTable
            columns={columns}
            data={filteredRows.length > 0 ? filteredRows : rows}
            direction="ltr"
            fixedHeaderScrollHeight="400px"
            noDataComponent="No Data Found"
            highlightOnHover
            pagination
            progressPending={pending}
            progressComponent={<Loader />}
            responsive
            striped
            subHeader
            subHeaderComponent={
              !isEmpty(rows) && (
                <SearchBar
                  searchExpanded={searchExpanded}
                  setSearchExpanded={setSearchExpanded}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                />
              )
            }
            subHeaderAlign="right"
            subHeaderWrap
          />
        }
      </div>
    </div>
  );
};

DataTables.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
};

export default DataTables;
