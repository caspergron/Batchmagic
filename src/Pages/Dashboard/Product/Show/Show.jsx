import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DateFormat from '../../../../components/DateFormat';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import ErrorModal from '../../../../components/ErrorModal';
import React from 'react';
import { Link } from 'react-router-dom';
import close from '../../../../assets/Logo/actions/cross.svg';
import { isEmpty } from '../../../../components/utils';

const Show = () => {
  const [product, setProduct] = useState();
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProduct = async () => {
      try {
        const response = await axiosPrivate.get(
          `/product/${params.id}?show_archive=true`,
          {
            signal: controller.signal,
          },
        );
        if (isMounted) {
          setProduct(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getProduct();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div>
      {isEmpty(product) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/product" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <Link to={`/dashboard/product/edit/${product.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>

          <div>
            <h1 className="align-self-start show-header mt-84">
              Product Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-product">
                <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <td>{product?.name}</td>
                    <th scope="col">Product Code</th>
                    <td>{product?.product_code}</td>
                    <th scope="col">Group</th>
                    <td>{product?.group}</td>
                  </tr>
                  <tr>
                    <th scope="col">External ID Ref</th>
                    <td>{product?.external_ref}</td>
                    <th scope="col">Created At</th>
                    <td>
                      <DateFormat dateValue={product?.created_at} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {product?.supplier && (
            <div>
              <h1 className="align-self-start show-header">
                Supplier Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped table-bordered show-table-last show-table-last-product">
                  <tbody>
                    <tr>
                      <th scope="col">Name</th>
                      <td>{product?.supplier?.name}</td>
                      <th scope="col">Address</th>
                      <td>{product?.supplier?.address}</td>
                    </tr>
                    <tr>
                      <th scope="col">City</th>
                      <td>{product?.supplier?.city}</td>
                      <th scope="col">Zip</th>
                      <td>{product?.supplier?.zip}</td>
                    </tr>
                    <tr>
                      <th scope="col">Contact Person Name</th>
                      <td>{product?.supplier?.contact_person_name}</td>
                      <th scope="col">Contact Person Phone</th>
                      <td>{product?.supplier?.contact_person_phone}</td>
                    </tr>
                    <tr>
                      <th scope="col">Contact Person Email</th>
                      <td>{product?.supplier?.contact_person_email}</td>
                      <th scope="col">Legal Identity Number</th>
                      <td>{product?.supplier?.legal_identity_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {product?.stocks?.length > 0 && (
            <div>
              <h1 className="align-self-start show-header">
                Stocks Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped show-table-last show-table-last-stock">
                  <thead>
                    <tr>
                      <th scope="col">Ingoing Batch Number</th>
                      <th scope="col">Total Weight (g)</th>
                      <th scope="col">Total Sold Weight (g)</th>
                      <th scope="col">Remaining Weight (g)</th>
                      <th scope="col">Last Stock Date</th>
                      <th scope="col">Best Before Date</th>
                      <th scope="col">Archive Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product?.stocks?.map((stock) => {
                      return (
                        <tr key={stock?.id}>
                          <td>{stock?.ingoing_batch_number}</td>
                          <td>{stock?.total_weight}</td>
                          <td>
                            {stock?.total_sold_weight == null
                              ? 0
                              : stock?.total_sold_weight}
                          </td>
                          <td>
                            {stock?.total_weight - stock?.total_sold_weight}
                          </td>
                          <td>
                            <DateFormat dateValue={stock?.last_stock_date} />
                          </td>
                          <td>
                            <DateFormat dateValue={stock?.best_before_date} />
                          </td>
                          <td>
                            <span
                              className={
                                stock?.is_archive ? 'stock-archived' : ''
                              }
                            >
                              {stock?.is_archive ? 'Archived' : 'Not Archived'}
                            </span>
                          </td>
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
