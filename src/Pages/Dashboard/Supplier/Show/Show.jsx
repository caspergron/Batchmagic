import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';

const Show = () => {
  const [supplier, setSupplier] = useState({});
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getSupplier = async () => {
      try {
        const response = await axiosPrivate.get(`/supplier/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted) {
          setSupplier(response.data.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getSupplier();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      {isEmpty(supplier) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/supplier" className="d-flex flex-column">
            <img
              className="align-self-end page-close show-page-close-position"
              src={close}
              alt=""
            />
          </Link>
          <Link to={`/dashboard/supplier/edit/${supplier.id}`}>
            <button
              type="button"
              className="align-self-end show-update-btn show-update-btn-position"
            >
              Update Info
            </button>
          </Link>

          <div>
            <h1 className="align-self-start show-header mt-84">
              Supplier Information
            </h1>
            <div className="d-flex flex-column show-table-body">
              <table className="table table-striped table-bordered show-table-first show-table-first-supplier">
                <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <td>{supplier?.name}</td>
                    <th scope="col">Address</th>
                    <td>{supplier?.address}</td>
                  </tr>
                  <tr>
                    <th scope="col">City</th>
                    <td>{supplier?.city}</td>
                    <th scope="col">Zip</th>
                    <td>{supplier?.zip}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Name</th>
                    <td>{supplier?.contact_person_name}</td>
                    <th scope="col">Contact Person Phone</th>
                    <td>{supplier?.contact_person_phone}</td>
                  </tr>
                  <tr>
                    <th scope="col">Contact Person Email</th>
                    <td>{supplier?.contact_person_email}</td>
                    <th scope="col">Legal Identity Number</th>
                    <td>{supplier?.legal_identity_number}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {supplier?.product?.length > 0 && (
            <div>
              <h1 className="align-self-start show-header">
                Product Information
              </h1>
              <div className="d-flex flex-column show-table-body">
                <table className="table table-striped table-bordered show-table-last show-table-last-supplier">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">External ID Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier?.product?.map((prod) => {
                      return (
                        <tr key={prod?.id}>
                          <td>{prod?.name}</td>
                          <td>{prod?.external_ref}</td>
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
