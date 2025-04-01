import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../../../assets/style/CommonCSS/Show.css';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';

export default function Show() {
  const [customer, setCustomer] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCustomer = async () => {
      try {
        const response = await axiosPrivate.get(`/customer/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setCustomer(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getCustomer();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div>
      {isEmpty(customer) ? (
        <Loader />
      ) : (
        <div /* className="d-flex flex-column show-container" */>
          <Link to="/dashboard/customers" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <Link to={`/dashboard/customers/edit/${customer.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>

          <div>
            <h1 className="align-self-start show-header mt-84">
              Customer Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-customer">
                <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <td>{customer?.name}</td>
                    <th scope="col">Address</th>
                    <td>{customer?.address}</td>
                  </tr>
                  <tr>
                    <th scope="col">City</th>
                    <td>{customer?.city}</td>
                    <th scope="col">Zip</th>
                    <td>{customer?.zip}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Name</th>
                    <td>{customer?.contact_person_name}</td>
                    <th scope="col">Contact Person Phone</th>
                    <td>{customer?.contact_person_phone}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Email</th>
                    <td>{customer?.contact_person_email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {customer?.shipments?.length > 0 && (
            <div>
              <h1 className="align-self-start show-header">
                Shipments Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped show-table-last show-table-last-customer">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Outgoing Batch Number</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Shipment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer?.shipments?.map((ship) => {
                      return (
                        <tr key={ship?.id}>
                          <td>{ship?.name}</td>
                          <td>{ship?.outgoing_batch?.outgoing_batch_code}</td>
                          <td>{ship?.quantity}</td>
                          <td>{ship?.shipment_date}</td>
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
}
