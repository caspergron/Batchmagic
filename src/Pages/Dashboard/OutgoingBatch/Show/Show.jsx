import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';

const Show = () => {
  const [batch, setBatch] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getBatch = async () => {
      try {
        const response = await axiosPrivate.get(
          `/outgoing-batch/${params.id}`,
          { signal: controller.signal },
        );
        if (isMounted) {
          setBatch(response.data.data[0]);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getBatch();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      {isEmpty(batch) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/outgoing-batch" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <Link to={`/dashboard/outgoing-batch/${batch.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>
          <div>
            <h1 className="align-self-start show-header mt-84">
              Batch Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-batches">
                <tbody>
                  <tr>
                    <th scope="col">Code</th>
                    <td>{batch?.outgoing_batch_code}</td>
                    <th scope="col">Total Quantity</th>
                    <td>{batch?.total_quantity + batch?.shipment_quantity}</td>
                  </tr>
                  <tr>
                    <th scope="col">Mix Recipe</th>
                    <td>{batch?.batch_template?.name}</td>
                    <th scope="col">Shipped Quantity</th>
                    <td>{batch?.shipment_quantity || 0}</td>
                  </tr>
                  <tr>
                    <th scope="col">Batch Weight (g)</th>
                    <td>
                      {Number(
                        (
                          (batch?.total_quantity + batch?.shipment_quantity) *
                          batch?.batch_template?.total_weight
                        ).toFixed(2),
                      )}
                    </td>
                    <th scope="col">Remaining Quantity</th>
                    <td>{batch?.total_quantity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {batch?.outgoing_stocks && (
            <div>
              <h1 className="align-self-start show-header">
                Stock Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped table-bordered show-table-last show-table-last-batches">
                  <thead>
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Weight (g)</th>
                      <th scope="col">Stock Number</th>
                    </tr>
                  </thead>

                  <tbody>
                    {batch?.outgoing_stocks?.map((outgoing_stock) => {
                      return (
                        <tr key={outgoing_stock?.id}>
                          <td>
                            {outgoing_stock?.stock?.related_product?.name}
                          </td>
                          <td>{Number(outgoing_stock?.weight?.toFixed(2))}</td>
                          <td>{outgoing_stock?.stock?.ingoing_batch_number}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Show;
