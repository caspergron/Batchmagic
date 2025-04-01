import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/style/CommonCSS/Edit.css';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import close from '../../../../assets/Logo/actions/cross.svg';

export default function Edit() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();
  const { err, setErr } = useState({});
  const [customer, setCustomer] = useState();
  const { setLoading } = useAuth();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCustomer = async () => {
      try {
        const res = await axiosPrivate.get(`/customer/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted && res.status === 200) {
          setLoading(false);
          controller.abort();
          setCustomer(res.data.data);
        }
      } catch (err) {
        setLoading(false);
        setErr(err.response.data.errors);
      }
    };
    getCustomer();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('address', customer.address);
      setValue('zip', customer.zip);
      setValue('city', customer.city);
      setValue('contact_person_name', customer.contact_person_name);
      setValue('contact_person_phone', customer.contact_person_phone);
      setValue('contact_person_email', customer.contact_person_email);
    }
  }, [customer, setValue]);

  const makeData = (data) => {
    return {
      name: data.name ? data.name : customer.name,
      address: data.address ? data.address : customer.address,
      zip: data.zip ? data.zip : customer.zip,
      city: data.city ? data.city : customer.city,
      contact_person_name: data.contact_person_name
        ? data.contact_person_name
        : customer.contact_person_name,
      contact_person_phone: data.contact_person_phone
        ? data.contact_person_phone
        : customer.contact_person_phone,
      contact_person_email: data.contact_person_email
        ? data.contact_person_email
        : customer.contact_person_email,
    };
  };

  const handleUpdateCustomer = async (data, e) => {
    const formData = makeData(data);
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.put(`/customer/${params.id}`, formData, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate('/dashboard/customers');
      }
    } catch (err) {
      setLoading(false);
      setErr(err.response.data.errors);
    }
  };

  const handleUnique = async (nameProperty, value) => {
    if (customer?.[nameProperty] !== value) {
      const controller = new AbortController();
      const data = {
        property: nameProperty,
        data: {
          [nameProperty]: value,
        },
      };

      try {
        const res = await axiosPrivate.post('/unique-customer-batch', data, {
          signal: controller.signal,
        });
        if (res.status === 200) {
          controller.abort();
          setError(nameProperty, {});
        }
      } catch (err) {
        setError(nameProperty, {
          type: 'manual',
          message: `The ${nameProperty} is not unique`,
        });
        controller.abort();
      }
    } else {
      setError(nameProperty, {});
    }
  };
  return (
    <div>
      {isEmpty(customer) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/customers" className="d-flex flex-column">
            <img
              className="align-self-end page-close edit-page-close-position"
              src={close}
              alt=""
            />
          </Link>
          <h1 className="text-center edit-header edit-header-my">
            Update Customer Information
          </h1>
          <form onSubmit={handleSubmit(handleUpdateCustomer)}>
            <div className="row p-5 edit-data-container edit-data-info">
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="name"
                  className="form-label fw-bold text-warning"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  onBlur={(e) => handleUnique('name', e.target.value)}
                  id="name"
                  defaultValue={customer?.name}
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
                {err && <p className="text-danger">{err?.name}</p>}
              </div>

              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="contact-person-name"
                  className="form-label fw-bold text-warning"
                >
                  Contact Person Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('contact_person_name', {
                    required: 'Contact person name is required',
                  })}
                  id="contact-person-name"
                  defaultValue={customer?.contact_person_name}
                  placeholder="Contact Person Name"
                />
                {errors.contact_person_name && (
                  <p className="text-danger">
                    {errors.contact_person_name.message}
                  </p>
                )}
                {err && (
                  <p className="text-danger">{err?.contact_person_name}</p>
                )}
              </div>
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="address"
                  className="form-label fw-bold text-warning"
                >
                  Address
                </label>
                <input
                  type="text"
                  {...register('address', {
                    required: 'Address is required',
                  })}
                  className="form-control"
                  defaultValue={customer?.address}
                  id="address"
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="text-danger">{errors.address.message}</p>
                )}
                {err && <p className="text-danger">{err?.address}</p>}
              </div>

              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="contact-person-email"
                  className="form-label fw-bold text-warning"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  {...register('contact_person_email', {
                    required: 'Contact person email is required',
                  })}
                  onBlur={(e) =>
                    handleUnique('contact_person_email', e.target.value)
                  }
                  defaultValue={customer?.contact_person_email}
                  id="contact-person-email"
                  placeholder="Contact Email"
                />
                {errors.contact_person_email && (
                  <p className="text-danger">
                    {errors.contact_person_email.message}
                  </p>
                )}
                {err && (
                  <p className="text-danger">{err?.contact_person_email}</p>
                )}
              </div>
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="city"
                  className="form-label fw-bold text-warning"
                >
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('city', {
                    required: 'City is required',
                  })}
                  defaultValue={customer?.city}
                  id="city"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-danger">{errors.city.message}</p>
                )}
                {err && <p className="text-danger">{err?.city}</p>}
              </div>
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="contact-person-phone"
                  className="form-label fw-bold text-warning"
                >
                  Contact Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  maxLength={20}
                  {...register('contact_person_phone', {
                    required: 'Contact phone number is Required',
                    minLength: {
                      value: 8,
                      message: 'Phone number must have at least 8 characters',
                    },
                    pattern: {
                      value: /^[0-9+]+$/,
                      message:
                        'Phone number can only contain numbers and the plus (+) character',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Phone number must have at most 20 digits',
                    },
                  })}
                  onBlur={(e) =>
                    handleUnique('contact_person_phone', e.target.value)
                  }
                  id="contact-person-phone"
                  defaultValue={customer?.contact_person_phone}
                  placeholder="Contact Phone"
                />
                {errors.contact_person_phone && (
                  <p className="text-danger">
                    {errors.contact_person_phone.message}
                  </p>
                )}
                {err && (
                  <p className="text-danger">{err?.contact_person_phone}</p>
                )}
              </div>
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="zip"
                  className="form-label fw-bold text-warning"
                >
                  Zip
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('zip', {
                    required: 'Zip is required',
                  })}
                  defaultValue={customer?.zip}
                  id="zip"
                  placeholder="Zip"
                />
                {errors.zip && (
                  <p className="text-danger">{errors.zip.message}</p>
                )}
                {err && <p className="text-danger">{err?.zip}</p>}
              </div>

              <div className="col-md-12 p-3 btn-customized">
                <button
                  type="submit"
                  disabled={
                    errors?.name?.message ||
                    errors?.contact_person_phone?.message ||
                    errors?.contact_person_email?.message
                  }
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
}
