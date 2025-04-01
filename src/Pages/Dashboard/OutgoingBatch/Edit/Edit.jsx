import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DropDown from '../../../../components/DropDown';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { isEmpty } from '../../../../components/utils';
import Loader from '../../../../components/Loader';
import close from '../../../../assets/Logo/actions/cross.svg';

const Edit = () => {
  const {
    register,
    handleSubmit,
    setValue,
    /* setError, */
  } = useForm();

  const [batch, setBatch] = useState([]);
  const [batchTemplates, setBatchTemplates] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState({});
  const [isUnique, setIsUnique] = useState(true);
  const { err, setErr } = useState({});
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getBatch = async () => {
      try {
        const res = await axiosPrivate.get(`/outgoing-batch/${params.id}`, {
          signal: controller.signal,
        });
        //console.log(res);
        if (isMounted && res.status === 200) {
          setLoading(false);
          setBatch(res.data.data[0]);
          controller.abort();
        }
      } catch (err) {
        setLoading(false);
        setErr(err.response.data.errors);
      }
    };
    getBatch();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (batch) {
      setValue('name', batch.outgoing_batch_code);
      setValue('quntity', batch.total_quntity);
    }
  }, [batch, setValue]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBatchTemplates = async () => {
      try {
        const res = await axiosPrivate.get(`/batch-templates`, {
          signal: controller.signal,
        });
        // console.log(res);
        if (isMounted && res.status === 200) {
          setLoading(false);
          controller.abort();
          setBatchTemplates(res.data.data);
        }
      } catch (err) {
        setLoading(false);
        setErr(err.response?.data?.errors);
      }
    };

    getBatchTemplates();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let updatedBatchProducts = [];

    setSelectedStocks(
      updatedBatchProducts.reduce((acc, batchProduct) => {
        acc[batchProduct.product_id] = {};
        return acc;
      }, {}),
    );
  }, [batchTemplates]);

  const makeData = (data) => {
    const stocks = Object.values(selectedStocks).reduce(
      (acc, productStocks) => {
        Object.keys(productStocks).forEach((stockId) => {
          if (productStocks[stockId]) {
            acc.push({
              stock_id: stockId,
              weight: productStocks[stockId],
            });
          }
        });
        return acc;
      },
      [],
    );
    const dataToSend = {
      outgoing_batch_code: data.name,
      stocks: stocks,
    };
    return dataToSend;
  };

  const handleUpdateBatch = async (data, e) => {
    const dataToSend = makeData(data);
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosPrivate.put(
        `/outgoing-batch/${params.id}`,
        dataToSend,
        {
          signal: controller.signal,
        },
      );

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate('/dashboard/outgoing-batch');
      }
    } catch (err) {
      setLoading(false);
      setErr(err.response.data.errors);
    }
  };

  const handleUnique = async (nameProperty, value) => {
    const controller = new AbortController();
    const data = {
      property: nameProperty,
      data: {
        [nameProperty]: value,
      },
    };

    try {
      const res = await axiosPrivate.post('/unique-outgoing-batch', data, {
        signal: controller.signal,
      });
      if (res.status === 200) {
        controller.abort();
        setIsUnique(true);
      }
    } catch (err) {
      setIsUnique(false);
      controller.abort();
    }
  };

  return (
    <div>
      {isEmpty(batch) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/outgoing-batch" className="d-flex flex-column">
            <img
              className="align-self-end page-close edit-page-close-position"
              src={close}
              alt=""
            />
          </Link>
          <h1 className="text-center edit-header edit-header-my">
            Update Batch
          </h1>
          <form onSubmit={handleSubmit(handleUpdateBatch)}>
            <div className="row p-5 edit-data-container">
              <div className="col-md-6 py-3 px-80 pr-1 edit-data-info">
                <div className="form-group py-3 d-flex align-items-center">
                  <label
                    htmlFor="name"
                    className="col-sm-4 text-warning fw-bold col-form-label"
                  >
                    Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control rounded-0"
                      {...register('name', {
                        required: 'Name is Required',
                      })}
                      onBlur={(e) =>
                        handleUnique('outgoing_batch_code', e.target.value)
                      }
                      id="name"
                      defaultValue={batch?.outgoing_batch_code}
                      placeholder="Name"
                    />
                    {!isUnique && (
                      <p className="text-danger">
                        The outgoing_batch_code is not unique
                      </p>
                    )}
                    {err && <p className="text-danger">{err?.name[0]}</p>}
                  </div>
                </div>
                <div className="form-group py-3 d-flex align-items-center">
                  <label
                    htmlFor="quantity"
                    className="col-sm-4 text-warning fw-bold col-form-label"
                  >
                    Quantity
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="number"
                      {...register('quantity')}
                      name="quantity"
                      className="form-control rounded-0"
                      id="quantity"
                      defaultValue={batch?.total_quantity}
                      placeholder="Quantity"
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group py-3 d-flex align-items-center">
                  <label
                    htmlFor="batch-template"
                    className="col-sm-4 text-warning fw-bold col-form-label"
                  >
                    Mix Recipe
                  </label>
                  <div className="col-sm-8 mixrecipe-dropdown">
                    <DropDown
                      defaultValue={batchTemplates.find(
                        (batchTemplate) =>
                          batchTemplate.id === batch?.batch_template_id,
                      )}
                      isDisabled
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 p-3 btn-customized">
                <button
                  type="submit"
                  disabled={!isUnique}
                  className="btn btn-orange float-end edit-update-btn"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Edit;
