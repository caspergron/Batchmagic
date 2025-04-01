import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import DataTables from '../../../../components/DataTablesNew';
import show from '../../../../assets/Logo/actions/show.svg';
import edit from '../../../../assets/Logo/actions/edit.svg';
import search from '../../../../assets/Logo/actions/search.svg';
import ErrorModal from '../../../../components/ErrorModal';
import useAuth from '../../../../hooks/useAuth';
import remove from '../../../../assets/Logo/actions/delete.svg';
import close from '../../../../assets/Logo/actions/cross.svg';

const OutgoingBatchesList = () => {
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState('');
  const { err, setErr } = useState({});
  const [deleteErr, setDeleteErr] = useState(false);
  const [deleteErrMsg, setDeleteErrMsg] = useState('');
  const { setLoading } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [batchToDelete, setBatchToDelete] = useState(null);

  const [sync, setSync] = useState(false);
  //const [showLoader, setShowLoader] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleModalOpen = (rowId) => {
    setIsDeleteModalOpen(true);
    setBatchToDelete(rowId);
  };

  const handleModalClose = () => {
    setDeleteErrMsg('');
    setDeleteErr(false);
    setIsDeleteModalOpen(false);
    setBatchToDelete(null);
  };

  // Handle deletion of product
  const handleDelete = async () => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(
        `/outgoing-batch/${batchToDelete}`,
        {
          signal: controller.signal,
        },
      );
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

  const columns = [
    {
      name: 'Batch Number',
      selector: (row) => row.outgoing_batch_code,
      sortable: true,
    },
    {
      name: 'Shipped Quantity',
      selector: (row) => row.shipment_quantity ?? 0,
      sortable: true,
    },
    {
      name: 'Remaining Quantity',
      selector: (row) => row.total_quantity,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <Link to={`/dashboard/outgoing-batch/show/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={show} className="show-action" alt="" />
            </button>
          </Link>
          <Link to={`/dashboard/outgoing-batch/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={edit} className="edit-action" alt="" />
            </button>
          </Link>{' '}
          <button
            className="btn btn-action-customized"
            onClick={() => handleModalOpen(row.id)}
          >
            <img src={remove} className="edit-action" alt="" />
          </button>
        </div>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getBatches = async () => {
      try {
        const response = await axiosPrivate.get('/outgoing-batches', {
          signal: controller.signal,
        });
        if (isMounted) {
          setBatches(response.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getBatches();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sync]);

  const handleSearchOutGoingBatch = async (data, e) => {
    const controller = new AbortController();
    // setShowLoader(true);
    e.preventDefault();
    try {
      const res = await axiosPrivate.get(
        `/outgoing-batch/search/${data.outgoing_batch_code}`,
        { signal: controller.signal },
      );
      if (res.status === 200) {
        // setShowLoader(false);
        controller.abort();
        navigate(`search/${data.outgoing_batch_code}`);
      } else {
        // setShowLoader(false);
      }
    } catch (err) {
      // setShowLoader(false);
      setLoading(false);
      setErr(err.response.data.errors);
    }
  };

  const memoizedData = useMemo(() => batches.data, [batches]);

  return (
    <>
      <div className="col-md-12 p-3 btn-customized">
        <div
          className="d-flex align-items-center float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <button type="submit" className="btn float-end">
            <span>
              <img src={search} className="search-action" alt="" />
            </span>
            <span>Search Outgoing Batch</span>
          </button>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-border-customized">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h1 className="text-center edit-header pt-3">
                  Search Outgoing Batch
                </h1>
                <form onSubmit={handleSubmit(handleSearchOutGoingBatch)}>
                  <div className="row p-5">
                    <div className="col-md-6 p-3">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label fw-bold search-header"
                      >
                        Outgoing Batch Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('outgoing_batch_code', {
                          required: 'Outgoing Batch Code is Required',
                        })}
                        id="exampleFormControlInput1"
                        placeholder="Outgoing Batch Code"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                      />
                      {errors.outgoing_batch_code && (
                        <p className="text-danger">
                          {errors.outgoing_batch_code.message}
                        </p>
                      )}
                      {err && (
                        <p className="text-danger">
                          {err?.outgoing_batch_code[0]}
                        </p>
                      )}
                    </div>
                    <div className="col-md-12 p-3 btn-customized">
                      <button
                        type="submit"
                        className="btn btn-orange float-end edit-update-btn"
                        /* data-bs-dismiss={!showLoader ? 'modal' : ''} */
                        data-bs-dismiss={message == '' ? '' : 'modal'}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-center my-64 list-header">Outgoing Batches</h1>
      <DataTables
        columns={columns}
        data={memoizedData}
        header={'A Batch'}
        navigation={'/dashboard/outgoing-batch/create'}
        searchPlaceholder="Search Batch"
      />

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
    </>
  );
};

export default OutgoingBatchesList;
