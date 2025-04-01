import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DateFormat from '../../../../../components/DateFormat';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import Loader from '../../../../../components/Loader';
import { isEmpty } from '../../../../../components/utils';
import ErrorModal from '../../../../../components/ErrorModal';
import close from '../../../../../assets/Logo/actions/cross.svg';

const Show = () => {
  const [stock, setStock] = useState({});
  const axiosPrivate = useAxiosPrivate();
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

  return (
    <div>
      {isEmpty(stock) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/product/stock" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <Link to={`/dashboard/product/stock/edit/${stock.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>
          <div>
            <h1 className="align-self-start show-header mt-84">
              Stock Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-stocks">
                <tbody>
                  <tr>
                    <th scope="col">Ingoing Batch Number</th>
                    <td>{stock?.ingoing_batch_number}</td>
                    <th scope="col">Product</th>
                    <td>{stock?.related_product?.name}</td>
                  </tr>
                  <tr>
                    <th scope="col">Best Before Date</th>
                    <td>
                      <DateFormat dateValue={stock?.best_before_date} />
                    </td>
                    <th scope="col">Last stock date</th>
                    <td>
                      <DateFormat dateValue={stock?.last_stock_date} />
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">Total Weight (Kg)</th>
                    <td>{Number(stock?.total_weight?.toFixed(2) / 1000)}</td>
                    <th scope="col">Total Sold Weight (Kg)</th>
                    <td>
                      {Number(
                        (stock?.total_sold_weight / 1000)?.toFixed(2) ?? 0,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">Remaining Weight (Kg)</th>
                    <td>
                      {Number(
                        (
                          (stock?.total_weight - stock?.total_sold_weight) /
                          1000
                        ).toFixed(2),
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {stock?.related_product && (
            <div>
              <h1 className="align-self-start show-header">
                Product Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped table-bordered show-table-last show-table-last-stocks">
                  <tbody>
                    <tr>
                      <th scope="col">Name</th>
                      <td>{stock?.related_product?.name}</td>
                      <th scope="col">Product Code</th>
                      <td>{stock?.related_product?.product_code}</td>
                    </tr>
                    <tr>
                      <th scope="col">External Ref ID</th>
                      <td>{stock?.related_product?.external_ref}</td>
                      <th scope="col">Created At</th>
                      <td>
                        <DateFormat
                          dateValue={stock?.related_product?.created_at}
                        />
                      </td>
                    </tr>
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
