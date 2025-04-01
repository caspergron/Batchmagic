import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import show from '../../../../assets/Logo/actions/show.svg';
import edit from '../../../../assets/Logo/actions/edit.svg';
import close from '../../../../assets/Logo/actions/cross.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import ErrorModal from '../../../../components/ErrorModal.jsx';
import DataTables from '../../../../components/DataTablesNew';
import { useForm } from 'react-hook-form';
import ErrorIcon from '@mui/icons-material/Error';

const ProductList = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [products, setProducts] = useState([]);
  const [sync, setSync] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get('/products', {
          signal: controller.signal,
        });
        if (isMounted) {
          setProducts(response.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getProducts();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sync]);

  const memoizedData = useMemo(() => products.data, [products]);

  useEffect(() => {
    if (products) {
      setValue(
        'shopify_id',
        products?.data?.filter((product) => product.id === selectedRowId)[0]
          ?.shopify_product_id,
      );
    }
  }, [products, selectedRowId, setValue]);

  const onShopifyIdModalClose = () => {
    setIsModalOpen(false);
    setSync(false);
  };

  const showShopifyIdModal = (rowId) => {
    setIsModalOpen(true);
    setSelectedRowId(rowId);
  };

  const handleShopifyId = async (value, e) => {
    const controller = new AbortController();
    e.preventDefault();
    const data = {
      shopify_product_id: value.shopify_id,
    };

    try {
      const res = await axiosPrivate.post(
        `product/sync/image/${selectedRowId}`,
        data,
        {
          signal: controller.signal,
        },
      );
      if (res.status === 200) {
        setIsModalOpen(false);
        setSync(true);
        controller.abort();
      }
    } catch (err) {
      setSync(false);
      console.log(err);
      controller.abort();
    }
  };

  const handleModalOpen = (rowId) => {
    setIsDeleteModalOpen(true);
    setProductToDelete(rowId);
  };

  const handleModalClose = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Handle deletion of product
  const handleDelete = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(
        `/product/${productToDelete}`,
        {
          signal: controller.signal,
        },
      );
      if (response.status === 200) {
        setSync(!sync); // Trigger re-fetching of products
        handleModalClose(); // Close modal after successful deletion
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      controller.abort();
    }
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
      sortable: true,
    },
    {
      name: 'Supplier',
      selector: (row) => row?.supplier?.name,
      sortable: true,
    },
    {
      name: 'Group',
      selector: (row) => row?.group ? row.group : 'N/A',
      sortable: true,
    },
    {
      name: 'Price per Kilo',
      selector: (row) =>
        row?.price_per_kilo ? (
          row.price_per_kilo
        ) : (
          <ErrorIcon sx={{ color: '#dc3545' }} />
        ),
      sortable: true,
    },
    {
      name: 'Stock Weight (kg)',
      selector: (row) => {
        let total = 0;
        let outgoing = 0;
        let remaining = 0;
        row?.stocks?.forEach((stock) => {
          total += stock.total_weight;
          outgoing += stock.total_sold_weight;
          remaining = (total - outgoing) / 1000;
        });
        return Number(remaining.toFixed(3));
      },
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <Link to={`/dashboard/product/show/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={show} className="show-action" alt="" />
            </button>
          </Link>
          <Link to={`/dashboard/product/edit/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={edit} className="edit-action" alt="" />
            </button>
          </Link>
          <button
            className="btn btn-action-customized"
            onClick={() => handleModalOpen(row.id)}
          >
            <img src={remove} className="edit-action" alt="" />
          </button>
          <button
            className="btn"
            onClick={() => showShopifyIdModal(row.id)}
            style={{
              border: 'solid black 2px',
              padding: '0 2px',
              margin: '6px 0',
              textWrap: 'nowrap',
              color: products.data.filter((product) => product.id === row.id)[0]
                ?.image
                ? 'white'
                : 'black',
              backgroundColor: products.data.filter(
                (product) => product.id === row.id,
              )[0]?.image
                ? 'black'
                : 'white',
            }}
          >
            {products.data.filter((product) => product.id === row.id)[0]?.image
              ? 'Synced'
              : 'Sync'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* <DashboardNavigation buttons={buttons} /> */}
      <h1 className="text-center my-64 list-header">Product</h1>
      <DataTables
        columns={columns}
        data={memoizedData}
        header={'Product'}
        navigation={'/dashboard/product/create'}
        searchPlaceholder="Search Product Stocks"
      />

      {isModalOpen && (
        <div className="modal-overlay-recipes">
          <div
            className="modal-body-recipes modal-body-recipes-ingredient"
            style={{ height: 'auto', width: '36%', marginTop: '0' }}
          >
            <div className="d-flex justify-content-end modal-header-recipes list-header">
              <img
                onClick={() => {
                  onShopifyIdModalClose();
                }}
                className="modal-close"
                src={close}
                alt=""
              />
            </div>
            <div className="modal-content-recipes">
              <form onSubmit={handleSubmit(handleShopifyId)}>
                <div className="d-flex justify-content-center p-2">
                  <div className="col-md-5 py-3">
                    <label
                      htmlFor="shopifyId"
                      className="d-flex justify-content-center form-label fw-bold"
                      style={{ fontSize: '18px' }}
                    >
                      Shopify Product ID:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('shopify_id', {
                        required: 'Shopify Product ID is required',
                      })}
                      id="shopifyId"
                      defaultValue={
                        products.data.filter(
                          (product) => product.id === selectedRowId,
                        )[0]?.shopify_product_id ?? ''
                      }
                    />
                    {errors.shopify_id && (
                      <p className="text-danger">{errors.shopify_id.message}</p>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center pt-3">
                  <button
                    type="submit"
                    className="btn btn-orange float-center create-create-btn"
                    style={{ width: '120px' }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
              <h5 className="text-center">
                Are you sure you want to <b>Archive</b> this product?
              </h5>
              <div className="d-flex justify-content-center pt-3">
                <button className="btn btn-danger mx-2" onClick={handleDelete}>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
