import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import edit from '../../../../../assets/Logo/actions/edit.svg';
import archive from '../../../../../assets/Logo/actions/archive.svg';
import unarchive from '../../../../../assets/Logo/actions/unarchive.png';
import show from '../../../../../assets/Logo/actions/show.svg';
import close from '../../../../../assets/Logo/actions/cross.svg';
import DataTables from '../../../../../components/DataTablesNew';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import ErrorModal from '../../../../../components/ErrorModal';

const StockModal = ({
  isOpen = true,
  onClose,
  product,
  setStockChanged,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  const [stocks, setStocks] = useState([]);
  const [isArchive, setIsArchive] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (product?.id) {
      fetchStocks(product.id, isArchive);
    }

    return () => {
      controller.abort();
    };
  }, [product?.id, isArchive]);

  const controller = new AbortController();

  const fetchStocks = async (id, archive) => {
    try {
      const response = await axiosPrivate.get(`/stock-archive/${id}?is_archive=${archive}`, {
        signal: controller.signal,
      });
      setStocks(response.data.data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request Aborted');
      } else {
        console.error('Error', error);
      }
    }
  };

  const handleArchiveClick = async (stockId, archive) => {
    try {
      const res = await axiosPrivate.put(
        `/stock-archive/${stockId}`,
        {
          is_archive: archive,
        },
        {
          signal: controller.signal,
        },
      );

      if (res.status === 200) {
        setStocks(stocks.filter((stock) => stock.id !== stockId));
      }
    } catch (err) {
      console.error('Error', err);
      <ErrorModal />;
    }
  };

  const columns = [
    {
      name: 'Batch No',
      selector: (row) => row.ingoing_batch_number,
      sortable: true,
    },
    {
      name: 'Sold (kg)',
      selector: (row) => row?.total_sold_weight / 1000 ?? 0,
    },
    {
      name: 'Total (kg)',
      selector: (row) => row?.total_weight / 1000,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <Link to={`/dashboard/product/stock/show/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={show} className="show-action" alt="" />
            </button>
          </Link>
          <Link to={`/dashboard/product/stock/edit/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={edit} className="edit-action" alt="" />
            </button>
          </Link>
          <button className="btn btn-action-customized" onClick={() => handleArchiveClick(row.id, row.is_archive == 0 ? 1 : 0)}>
            <img src={isArchive === 0 ? archive : unarchive} className="archives-action" alt="" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="stock-modal">
        <div className="d-flex flex-column stock-modal-header list-header">
          <h2>Stock Details</h2>
          <img
            onClick={() => {
              setStockChanged(true);
              onClose();
            }}
            className="align-self-end page-close"
            src={close}
            alt=""
          />
        </div>
        <button
          onClick={() => setIsArchive(isArchive === 0 ? 1 : 0)}
          className={isArchive === 0 ? 'btn btn-danger float-end m-2' : 'btn btn-success float-end m-2'}
        >
          {isArchive === 0 ? 'Show Archived' : 'Show Active'}
        </button>
        <div className="stock-modal-content">
          {children}
          <DataTables
            columns={columns}
            data={stocks}
            header={'Stocks'}
            navigation={'/dashboard/product/stock/create'}
            searchPlaceholder="Search Product"
          />
        </div>
      </div>
    </div>
  );
};

StockModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  product: PropTypes.object,
  setStockChanged: PropTypes.func,
};

export default StockModal;
