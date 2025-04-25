import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';

export default function Show() {
  const [shipment, setShipment] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getShipment = async () => {
      try {
        const response = await axiosPrivate.get(`/shipment/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setShipment(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getShipment();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div>
      {isEmpty(shipment) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/orders" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>
          <Link to={`/dashboard/orders/edit/${shipment.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>
          <div>
            <h1 className="align-self-start show-header mt-84">
              Order Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-shipment">
                <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <td>{shipment?.name}</td>
                    <th scope="col">Outgoing Batch Number</th>
                    <td>{shipment?.outgoing_batch?.outgoing_batch_code}</td>
                  </tr>
                  <tr>
                    <th scope="col">Quantity</th>
                    <td>{shipment?.quantity}</td>
                    <th scope="col">Shipment Date</th>
                    <td>{shipment?.order_date}</td>
                  </tr>
                  <tr>
                    <th scope="col">Mix Recipe</th>
                    <td>{shipment?.batch_template?.name}</td>
                    <th scope="col">Total Weight</th>
                    <td>{shipment?.batch_template?.total_weight}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h1 className="align-self-start show-header">
              Customer Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-last show-table-last-shipment">
                <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <td>{shipment?.customer?.name}</td>
                    <th scope="col">Address</th>
                    <td>{shipment?.customer?.address}</td>
                  </tr>
                  <tr>
                    <th scope="col">City</th>
                    <td>{shipment?.customer?.city}</td>
                    <th scope="col">Zip</th>
                    <td>{shipment?.customer?.zip}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Name</th>
                    <td>{shipment?.customer?.contact_person_name}</td>
                    <th scope="col">Contact Person Phone</th>
                    <td>{shipment?.customer?.contact_person_phone}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Email</th>
                    <td>{shipment?.customer?.contact_person_email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
