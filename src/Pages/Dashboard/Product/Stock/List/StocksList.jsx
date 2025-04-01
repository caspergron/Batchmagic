// Index.js
import React, { useEffect, useState, useMemo } from 'react';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import show from '../../../../../assets/Logo/actions/show.svg';
import StockModal from '../Components/StockModal';
import ErrorModal from '../../../../../components/ErrorModal';
import DataTables from '../Components/DataTablesStock';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [stockChanged, setStockChanged] = useState(false);
  const [order, setOrder] = useState('asc');
  const [rowChange, setRowChange] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get('/products-stocks', {
          signal: controller.signal,
          params: {
            sorting_order: order,
            sort_by: 'stock_needed',
          },
        });
        if (isMounted) {
          console.log(response);
          setProducts(response.data.data.products);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getProducts();
    setStockChanged(false);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [stockChanged, axiosPrivate, order, rowChange]);

  const handleSort = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const filteredProducts = useMemo(() => products, [products]);

  const showStockModal = (rowId) => {
    setSelectedRowId(rowId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const columns = [
    {
      name: 'Image',
      selector: (row) => {
        return row.image ? (
          <img
            src={row.image}
            alt=""
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        ) : null;
      },
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Supplier',
      selector: (row) => row?.supplier?.name,
    },
    {
      name: 'Stock Weight (kg)',
      selector: (row) => Number(parseFloat(row?.stock_weight).toFixed(2)),
      // sortable: true,
    },
    {
      name: 'Stock Needed',
      selector: (row) => Number(parseFloat(row?.stock_needed).toFixed(2)),
      sortable: true,
      // sortFunction: handleSort, // New property
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <button
            className="btn btn-action-customized"
            onClick={() => showStockModal(row.id)}
          >
            <img src={show} className="show-action" alt="" />
          </button>
        </div>
      ),
    },
  ];

  const handlePerRowsChange = async () => {
    setRowChange(!rowChange);
  };

  return (
    <div>
      <h1 className="text-center my-64 list-header">Product Stocks</h1>
      <DataTables
        columns={columns}
        data={filteredProducts}
        header={'Stocks'}
        navigation={'/dashboard/product/stock/create'}
        searchPlaceholder="Search Products"
        onSort={handleSort}
        onChangeRowsPerPage={handlePerRowsChange}
      />

      {selectedRowId && (
        <StockModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={products.find((product) => product.id === selectedRowId)}
          setStockChanged={setStockChanged}
        >
          {/* Render your modal content here */}
        </StockModal>
      )}
    </div>
  );
};

export default Index;
