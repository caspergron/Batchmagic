import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
// import ErrorModal from '../../../../components/ErrorModal';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import CostBreakdownTooltip from '../components/CostBreakdownTooltip';
import DataTablesPagination from '../../../../components/DataTablesNewPagination';
// import closeIcon from '../../../../assets/Logo/actions/cross.svg';
import show from '../../../../assets/Logo/actions/show.svg';
import edit from '../../../../assets/Logo/actions/edit.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import Loader from '../../../../components/Loader';

export default function Index() {
  const [shipments, setShipments] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [meta, setMeta] = useState({});
  const [sync, setSync] = useState(false);
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleteErrMsg, setDeleteErrMsg] = useState('');
  // const [error, setError] = useState({ active: false, message: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Pagination & Sorting States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const columns = [
    {
      name: 'Price',
      selector: (row) => (
        <Tooltip
          title={row.price ? 'Price is updated.' : 'Price is NOT updated!'}
          arrow
        >
          {row.price ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <WarningIcon color="warning" />
          )}
        </Tooltip>
      ),
    },
    { name: 'Name', selector: (row) => row.name || 'N/A', sortable: true },
    {
      name: 'Customer Name',
      selector: (row) => <div style={{ whiteSpace: "normal" }}>{row.customer_name || 'N/A'}</div>,
      sortable: true
    },
    {
      name: 'Batch Number',
      selector: (row) => row.outgoing_batch_code || 'N/A' || <span style={{ color: 'red' }}>Waiting...</span>,
      sortable: true,
    },
    { name: 'Mix Recipe', selector: (row) => row.batchTemplate, sortable: true },
    { name: 'Quantity', selector: (row) => row.quantity, sortable: true },
    {
      name: 'Profit',
      cell: (row) => (
        <div style={{ color: row.profit > 0 ? 'green' : row.profit < 0 ? 'red' : 'black' }}>
          {Number(row.profit).toFixed(2)}
          <CostBreakdownTooltip cost={row} />
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <Link to={`/dashboard/orders/show/${row.id}`}>
            <img src={show} alt="View" style={{
              width: '20px',
              height: '20px',
              marginRight: '10px',
              cursor: 'pointer',
            }} />
          </Link>
          <Link to={`/dashboard/orders/edit/${row.id}`}>
            <img src={edit} alt="Edit" style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }} />
          </Link>
          <img src={remove} alt="Delete" style={{
            width: '20px',
            height: '20px',
            marginRight: '10px',
            cursor: 'pointer',
          }} onClick={() => handleModalOpen(row.id)} />
        </div>
      ),
    },
  ];

  const handleModalOpen = (rowId) => {
    setIsDeleteModalOpen(true);
    setOrderToDelete(rowId);
  };


  const handleDelete = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/shipment/${orderToDelete}`, {
        signal: controller.signal,
      });
      if (response.status === 200) {
        setSync(!sync); // Trigger re-fetching of products
        handleModalClose(); // Close modal after successful deletion
      }
    } catch (error) {
      setDeleteErr(true);
      setDeleteErrMsg(error.response.data.message);
    } finally {
      controller.abort();
    }
  };



  const handleModalClose = () => {
    setDeleteErr(false);
    setDeleteErrMsg('');
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchShipments = async () => {
      try {
        const response = await axiosPrivate.get('/shipments', {
          params: { page: currentPage, size: rowsPerPage, search: searchQuery, sort: sortColumn, direction: sortDirection },
          signal: controller.signal,
        });
        setShipments(response.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchShipments();
    return () => controller.abort();
  }, [currentPage, rowsPerPage, searchQuery, sortColumn, sortDirection, sync]);

  const memoizedData = useMemo(() => shipments.data || [], [shipments]);

  return (
    <div>
      <h1 className="text-center my-4">Orders</h1>
      {
        shipments.data && shipments.data.length > 0 ? (
          <DataTablesPagination
            columns={columns}
            data={memoizedData}
            meta={meta}
            header="Orders"
            navigation="/dashboard/orders/create"
            searchPlaceholder="Search Orders"
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
            setSearchQuery={setSearchQuery}
            setSortColumn={setSortColumn}
            setSortDirection={setSortDirection}
          />
        ) : (
          <Loader />
        )

      }


      {isDeleteModalOpen && (
        <div className="modal-overlay-recipes">
          <div
            className="modal-body-recipes modal-body-recipes-ingredient"
            style={{ height: 'auto', width: '36%', marginTop: '0' }}
          >
            <div className="d-flex justify-content-end modal-header-recipes list-header">
              <img
                onClick={handleModalClose}
                className="modal-close"
                src={close}
                alt="Close"
              />
            </div>
            <div className="modal-content-recipes">
              {!deleteErr ? (
                <div>
                  <h5 className="text-center">
                    Are you sure you want to <b>Delete</b> this batch?
                  </h5>
                  <div className="d-flex justify-content-center pt-3">
                    <button
                      className="btn btn-danger mx-2"
                      onClick={handleDelete}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-secondary mx-2"
                      onClick={handleModalClose}
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="text-center text-danger">
                    Sorry, This item cannot be deleted as{' '}
                    <b>{deleteErrMsg ? deleteErrMsg : 'An error occurred'}</b>.
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
