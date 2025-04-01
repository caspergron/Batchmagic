import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DropDown from '../../../../../components/DropDown';
import useAuth from '../../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import Loader from '../../../../../components/Loader';
import { isEmpty } from '../../../../../components/utils';
import ErrorModal from '../../../../../components/ErrorModal';
import close from '../../../../../assets/Logo/actions/cross.svg';

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState({});
  const [stock, setStock] = useState({});
  const { err, setErr } = useState({});
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getStock = async () => {
      try {
        const response = await axiosPrivate.get(`/stock/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setStock(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getStock();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setValue('total_weight', stock?.total_weight);
    setValue('ingoing_batch_number', stock?.ingoing_batch_number);
    setValue('last_stock_date', stock?.last_stock_date);
    setValue('best_before_date', stock?.best_before_date);

    setProductId(stock.product_id);
  }, [stock, setValue]);

  useEffect(() => {
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const res = await axiosPrivate.get('/products', {
          signal: controller.signal,
        });
        if (res.status === 200) {
          setProducts(res?.data?.data);
        }
      } catch (err) {
        <ErrorModal />;
      }
    };
    getProducts();
    return () => {
      controller.abort();
    };
  }, []);

  const handleDropDown = (product) => {
    setProductId(product?.id);
  };

  const handleUpdateProduct = async (data, e) => {
    data.product_id = productId;
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.put(`/stock/${params.id}`, data, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate(`/dashboard/product/stock/show/${params.id}`);
      }
    } catch (err) {
      setLoading(false);
      <ErrorModal />;
      setErr(err.response.data.errors);
    }
  };

  return (
    <div>
      {isEmpty(stock) ? (
        <Loader />
      ) : (
        <div>
          <div>
            <Link to="/dashboard/product/stock" className="d-flex flex-column">
              <img
                className="align-self-end page-close edit-page-close-position"
                src={close}
                alt=""
              />
            </Link>
            <h1 className="text-center edit-header edit-header-my">
              Update Stock
            </h1>
            <form onSubmit={handleSubmit(handleUpdateProduct)}>
              <div className="row p-5 edit-data-container edit-data-info">
                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="product"
                    className="form-label fw-bold text-warning"
                  >
                    Product
                  </label>
                  <DropDown
                    handleDropDown={handleDropDown}
                    dropDownValue={products}
                    defaultValue={products.find(
                      (product) => product.id === stock?.product_id,
                    )}
                    isDisabled={stock?.total_sold_weight > 0}
                  />
                </div>
                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="weight"
                    className="form-label fw-bold text-warning"
                  >
                    Weight (g)
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    step="0.01"
                    max={999999.99}
                    {...register('total_weight', {
                      required: 'Weight is required',
                      max: {
                        value: 999999.99,
                        message: 'Weight must be less than 999999.99',
                      },
                      min: {
                        value: stock?.total_sold_weight ?? 0,
                        message: `Weight must be greater than ${
                          stock?.total_sold_weight ?? 0
                        }`,
                      },
                    })}
                    id="weight"
                    placeholder="Weight"
                  />
                  {errors.total_weight && (
                    <p className="text-danger">{errors.total_weight.message}</p>
                  )}
                  {err && <p className="text-danger">{err?.total_weight[0]}</p>}
                </div>
                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="batch-number"
                    className="form-label fw-bold text-warning"
                  >
                    Batch Number
                  </label>
                  <input
                    type="text"
                    {...register('ingoing_batch_number', {
                      required: 'Batch number is Required',
                    })}
                    className="form-control rounded-0"
                    id="batch-number"
                    placeholder="Batch number"
                    disabled={stock?.total_sold_weight > 0}
                  />
                  {errors.ingoing_batch_number && (
                    <p className="text-danger">
                      {errors.ingoing_batch_number.message}
                    </p>
                  )}
                  {err && (
                    <p className="text-danger">{err?.ingoing_batch_number}</p>
                  )}
                </div>
                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="stock-date"
                    className="form-label fw-bold text-warning"
                  >
                    Stock Date
                  </label>
                  <input
                    type="date"
                    {...register('last_stock_date', {
                      required: 'Last Stock Date is Required',
                    })}
                    className="form-control rounded-0"
                    id="stock-date"
                  />
                  {errors.last_stock_date && (
                    <p className="text-danger">
                      {errors.last_stock_date.message}
                    </p>
                  )}
                  {err && <p className="text-danger">{err?.last_stock_date}</p>}
                </div>

                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="batch-before-date"
                    className="form-label fw-bold text-warning"
                  >
                    Best Before Date
                  </label>
                  <input
                    type="date"
                    {...register('best_before_date', {
                      required: 'Best Before Date is Required',
                    })}
                    className="form-control rounded-0"
                    id="batch-before-date"
                  />
                  {errors.best_before_date && (
                    <p className="text-danger">
                      {errors.best_before_date.message}
                    </p>
                  )}
                  {err && (
                    <p className="text-danger">{err?.best_before_date}</p>
                  )}
                </div>
                {productId && (
                  <div className="col-md-12 p-3 btn-customized">
                    <button
                      type="submit"
                      className="btn btn-orange float-end edit-update-btn"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
