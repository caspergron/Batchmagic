import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import close from '../../../../assets/Logo/actions/cross.svg';

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();
  const { err, setErr } = useState({});
  const [supplier, setSupplier] = useState();
  const { setLoading } = useAuth();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getSupplier = async () => {
      try {
        const res = await axiosPrivate.get(`/supplier/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted && res.status === 200) {
          setLoading(false);
          controller.abort();
          setSupplier(res.data.data);
        }
      } catch (err) {
        setLoading(false);
        setErr(err.response.data.errors);
      }
    };
    getSupplier();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (supplier) {
      setValue('name', supplier.name);
      setValue('address', supplier.address);
      setValue('zip', supplier.zip);
      setValue('city', supplier.city);
      setValue('contact_person_name', supplier.contact_person_name);
      setValue('contact_person_phone', supplier.contact_person_phone);
      setValue('contact_person_email', supplier.contact_person_email);
    }
  }, [supplier, setValue]);

  const makeData = (data) => {
    return {
      name: data.name ? data.name : supplier.name,
      address: data.address ? data.address : supplier.address,
      zip: data.zip ? data.zip : supplier.zip,
      city: data.city ? data.city : supplier.city,
      contact_person_name: data.contact_person_name
        ? data.contact_person_name
        : supplier.contact_person_name,
      contact_person_phone: data.contact_person_phone
        ? data.contact_person_phone
        : supplier.contact_person_phone,
      contact_person_email: data.contact_person_email
        ? data.contact_person_email
        : supplier.contact_person_email,
    };
  };

  const handleUpdateSupplier = async (data, e) => {
    const formData = makeData(data);
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.put(`/supplier/${params.id}`, formData, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate('/dashboard/supplier');
      }
    } catch (err) {
      setLoading(false);
      setErr(err.response.data.errors);
    }
  };

  const handleUnique = async (nameProperty, value) => {
    if (supplier?.[nameProperty] !== value) {
      const controller = new AbortController();
      const data = {
        property: nameProperty,
        data: {
          [nameProperty]: value,
        },
      };

      try {
        const res = await axiosPrivate.post('/unique-supplier', data, {
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
      <div>
        {isEmpty(supplier) ? (
          <Loader />
        ) : (
          <div>
            <Link to="/dashboard/supplier" className="d-flex flex-column">
              <img
                className="align-self-end page-close edit-page-close-position"
                src={close}
                alt=""
              />
            </Link>
            <h1 className="text-center edit-header edit-header-my">
              Update Supplier Information
            </h1>
            <form onSubmit={handleSubmit(handleUpdateSupplier)}>
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
                      required: 'Name is Required',
                    })}
                    onBlur={(e) => handleUnique('name', e.target.value)}
                    id="name"
                    defaultValue={supplier?.name}
                    placeholder="Name"
                  />
                  {errors.name && (
                    <p className="text-danger">{errors.name.message}</p>
                  )}
                  {err && <p className="text-danger">{err?.name[0]}</p>}
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
                      required: 'Contact Person Name is Required',
                    })}
                    id="contact-person-name"
                    defaultValue={supplier?.contact_person_name}
                    placeholder="Contact Person"
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
                      required: 'Address is Required',
                    })}
                    className="form-control"
                    defaultValue={supplier?.address}
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
                    Contact Person Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    {...register('contact_person_email', {
                      required: 'Contact Person Email is Required',
                    })}
                    onBlur={(e) =>
                      handleUnique('contact_person_email', e.target.value)
                    }
                    defaultValue={supplier?.contact_person_email}
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
                      required: 'City is Required',
                    })}
                    defaultValue={supplier?.city}
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
                    htmlFor="contact-phone"
                    className="form-label fw-bold text-warning"
                  >
                    Contact Person Phone
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
                        message: 'Phone number must have at most 20 characters',
                      },
                    })}
                    onBlur={(e) =>
                      handleUnique('contact_person_phone', e.target.value)
                    }
                    id="contact-phone"
                    defaultValue={supplier?.contact_person_phone}
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
                      required: 'Zip is Required',
                    })}
                    defaultValue={supplier?.zip}
                    id="zip"
                    placeholder="Zip"
                  />
                  {errors.zip && (
                    <p className="text-danger">{errors.zip.message}</p>
                  )}
                  {err && <p className="text-danger">{err?.zip}</p>}
                </div>
                <div className="col-md-6 py-3 px-80">
                  <label
                    htmlFor="legal-entity-number"
                    className="form-label fw-bold text-warning"
                  >
                    Legal Entity Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    id="legal-entity-number"
                    defaultValue={supplier?.legal_identity_number}
                    placeholder="Legal Entity Number"
                  />
                  {errors.legal_identity_number && (
                    <p className="text-danger">
                      {errors.legal_identity_number.message}
                    </p>
                  )}
                  {err && (
                    <p className="text-danger">{err?.legal_identity_number}</p>
                  )}
                </div>

                <div className="col-md-12 p-3 mt-5">
                  <button
                    type="submit"
                    disabled={
                      errors?.name?.message ||
                      errors?.legal_identity_number?.message ||
                      errors?.contact_person_phone?.message ||
                      errors?.contact_person_email?.message
                    }
                    className="btn-orange float-end edit-update-btn"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
