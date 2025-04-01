import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DateFormat from '../../../../components/DateFormat';
import { isEmpty } from '../../../../components/utils';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';
import ErrorIcon from '@mui/icons-material/Error';

const Show = () => {
  const [batchTemplate, setBatchTemplate] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getBatchtemplate = async () => {
      try {
        const response = await axiosPrivate.get(
          `/batch-template/${params.id}`,
          {
            signal: controller.signal,
          },
        );
        if (isMounted) {
          setBatchTemplate(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getBatchtemplate();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      {isEmpty(batchTemplate) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/mix-recipes" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <Link to={`/dashboard/mix-recipes/edit/${batchTemplate.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>

          <div>
            <h1 className="align-self-start show-header mt-84">
              Recipe Information
            </h1>

            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-mixrecipe">
                <tbody>
                  <tr>
                    <th scope="col">Mix Recipe Name</th>
                    <td>{batchTemplate?.name}</td>
                    <th scope="col">Total Weight (g)</th>
                    <td>{Number(batchTemplate?.total_weight?.toFixed(2))}</td>
                  </tr>
                  <tr>
                    <th scope="col">External ID Ref</th>
                    <td>{batchTemplate?.external_ref}</td>
                    <th scope="col"> Create At</th>
                    <td>
                      <DateFormat dateValue={batchTemplate?.created_at} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {batchTemplate?.batch_products?.length > 0 && (
            <div>
              <h1 className="align-self-start show-header">
                Product Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped table-bordered show-table-last show-table-last-mixrecipe">
                  <thead>
                    <tr>
                      <th scope="col" className="text-orange">
                        Product Name
                      </th>
                      <th scope="col" className="text-orange">
                        Weight(g)
                      </th>
                      <th scope="col" className="text-orange">
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="text-orange"
                        style={{ minWidth: 100, textAlign: 'center' }}
                      >
                        Cost
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {batchTemplate?.batch_products?.map((product) => {
                      return (
                        <tr key={product?.id}>
                          <td> {product?.product?.name}</td>
                          <td>{Number(product?.weight?.toFixed(2))}</td>
                          <td>{product?.amount}</td>
                          <td style={{ textAlign: 'center' }}>
                            {product?.product.cost ? (
                              product.product.calculation.toFixed(2)
                            ) : (
                              <ErrorIcon sx={{ color: '#dc3545' }} />
                            )}
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
