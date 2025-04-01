import React from 'react';
import { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { Link, useParams } from 'react-router-dom';
import close from '../../../../assets/Logo/actions/cross.svg';

export default function Search() {
  // const { err, setErr } = useState({});
  const { setLoading } = useAuth();
  const [foundBatch, setFoundBatch] = useState();
  // const [foundItem, setFoundItem] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();

  useEffect(() => {
    console.log(params);
    const controller = new AbortController();
    setShowLoader(true);
    const getBatch = async () => {
      try {
        const res = await axiosPrivate.get(
          `/outgoing-batch/search/${params.id}`,
          { signal: controller.signal },
        );

        if (res.status === 200) {
          setFoundBatch(res.data.data);
          // setFoundItem(true);
          setShowLoader(false);
          controller.abort();
        } else {
          // setFoundItem(false);
          setShowLoader(false);
        }
      } catch (err) {
        // setFoundItem(false);
        setLoading(false);
        // setErr(err.response.data.errors);
      }
    };
    getBatch();

    return () => {
      setShowLoader(false);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    console.log(foundBatch);
    if (foundBatch?.batch_template?.batch_products) {
      const newBatchProducts = foundBatch.batch_template.batch_products.map(
        (batchProduct) => {
          const stocks = foundBatch.outgoing_stocks.find(
            (stocks) => stocks.stock.product_id === batchProduct?.product.id,
          );
          return {
            ...batchProduct,
            ingoing_batch: stocks?.stock.ingoing_batch_number,
          };
        },
      );

      if (
        JSON.stringify(newBatchProducts) !==
        JSON.stringify(foundBatch.batch_template.batch_products)
      ) {
        setFoundBatch((prev) => ({
          ...prev,
          batch_template: {
            ...prev.batch_template,
            batch_products: newBatchProducts,
          },
        }));
      }
    }
  }, [foundBatch?.batch_template?.batch_products]);

  return (
    <div>
      {showLoader ? (
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
          {foundBatch?.outgoing_batch_code ? (
            <div>
              <h3 className="text-left edit-header edit-header-my batch-found-header">
                Batch Number Found:
                <span className="text-purple mx-2">
                  {foundBatch?.outgoing_batch_code}
                </span>
              </h3>
              <div className="row p-5 edit-data-container">
                <div className="col-md-12 p-3">
                  <table className="table outgoing-batch-table-header">
                    <thead>
                      <tr>
                        <th scope="col">Customer</th>
                        <th scope="col">Contact</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Date of shipment</th>
                        <th scope="col">Total weight</th>
                        {/* <th scope="col">Breakdown</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {foundBatch.shipment.map((ship) => (
                        <tr key={ship?.id}>
                          <td>{ship.customer.name}</td>
                          <td>
                            {' '}
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target={`#customerModal${ship.id}`}
                            >
                              INFO
                            </button>
                          </td>
                          <td>{ship.quantity}</td>
                          <td>{ship.shipment_date}</td>
                          <td>
                            {ship.quantity *
                              foundBatch?.batch_template?.total_weight}
                          </td>
                          {/* <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target={`#breakdownModal${ship.id}`}
                            >
                              INFO
                            </button>
                          </td> */}

                          <div
                            className="modal fade"
                            id={`customerModal${ship.id}`}
                            tabIndex="-1"
                            aria-labelledby={`customerModalLabel${ship.id}`}
                            aria-hidden="true"
                          >
                            <div className="modal-dialog  modal-dialog-centered modal-border-customized">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id={`customerModalLabel${ship.id}`}
                                  >
                                    Customer Details
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="name"
                                        className="text-purple"
                                      >
                                        Name:
                                      </label>
                                      <p id="name">{ship.customer.name}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="email"
                                        className="text-purple"
                                      >
                                        Address:
                                      </label>
                                      <p id="email">{ship.customer.address}</p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="address"
                                        className="text-purple"
                                      >
                                        Address:
                                      </label>
                                      <p id="address">
                                        {ship.customer.address}
                                      </p>
                                    </div>
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="phone"
                                        className="text-purple"
                                      >
                                        City:
                                      </label>
                                      <p id="phone">{ship.customer.city}</p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="phone"
                                        className="text-purple"
                                      >
                                        Zip:
                                      </label>
                                      <p id="phone">{ship.customer.zip}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="address"
                                        className="text-purple"
                                      >
                                        Contact Person Name:
                                      </label>
                                      <p id="address">
                                        {ship.customer.contact_person_name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="phone"
                                        className="text-purple"
                                      >
                                        Contact Person Phone:
                                      </label>
                                      <p id="phone">
                                        {ship.customer.contact_person_phone}
                                      </p>
                                    </div>
                                    <div className="col-md-6">
                                      <label
                                        htmlFor="address"
                                        className="text-purple"
                                      >
                                        Contact Person Email:
                                      </label>
                                      <p id="address">
                                        {ship.customer.contact_person_email}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                </div> */}
                              </div>
                            </div>
                          </div>

                          {/* <div
                            className="modal fade"
                            id={`breakdownModal${ship.id}`}
                            tabIndex="-1"
                            aria-labelledby={`breakdownModalLabel${ship.id}`}
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-xl modal-dialog-centered modal-border-customized">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id={`breakdownModalLabel${ship.id}`}
                                  >
                                    Break Down
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body ">
                                  <table className="table table-striped outgoing-batch-table-header">
                                    <thead>
                                      <tr>
                                        <th scope="col">Product</th>
                                        <th scope="col">
                                          Ingoing batch numbers
                                        </th>
                                        <th scope="col">Total weight</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        <>
                                          {foundBatch.batch_template?.batch_products.map(
                                            (product) => (
                                              <tr key={product?.id}>
                                                <td>{product?.product.name}</td>
                                                <td className="d-flex">
                                                  {foundBatch.outgoing_stocks.map(
                                                    (stocks) =>
                                                      stocks.stock
                                                        .product_id ===
                                                        product?.product.id && (
                                                        <p
                                                          className="mx-3"
                                                          key={stocks.id}
                                                        >
                                                          {
                                                            stocks.stock
                                                              .ingoing_batch_number
                                                          }
                                                        </p>
                                                      ),
                                                  )}
                                                </td>

                                                <td>
                                                  {(
                                                    product?.weight *
                                                    ship.quantity
                                                  ).toFixed(2)}
                                                </td>
                                              </tr>
                                            ),
                                          )}
                                          <tr className="my-3"></tr>

                                          <tr className="bg-transparent my-3">
                                            <td></td>
                                            <td className="fw-bold">
                                              Mass balance :{' '}
                                            </td>

                                            <td className="fw-bold">
                                              {ship.quantity *
                                                foundBatch?.batch_template
                                                  ?.total_weight}
                                            </td>
                                          </tr>
                                        </>
                                      }
                                    </tbody>
                                  </table>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center p-5 edit-data-container edit-header-my">
              <h3 className="text-danger">No Outgoing Batch Found!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
