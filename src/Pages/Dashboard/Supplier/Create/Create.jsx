import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import close from '../../../../assets/Logo/actions/cross.svg';

const Create = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { err, setErr } = useState({});
  // const [error, setError] = useState(false);
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleAddSupplier = async (data, e) => {
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post('/supplier', data, {
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
  };

  return (
    <div>
      <div>
        <Link to="/dashboard/supplier" className="d-flex flex-column">
          <img
            className="align-self-end page-close create-page-close-position"
            src={close}
            alt=""
          />
        </Link>
        <h1 className="text-center create-header create-header-my">
          Create New Suppliers
        </h1>
        <form onSubmit={handleSubmit(handleAddSupplier)}>
          <div className="row p-5 create-data-container create-data-info">
            <div className="col-md-6 py-3 px-80">
              <label htmlFor="name" className="form-label fw-bold text-warning">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                {...register('name', {
                  required: 'Name is Required',
                  validate: errors?.name?.message,
                })}
                onBlur={(e) => handleUnique('name', e.target.value)}
                id="name"
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
                placeholder="Contact Person Name"
              />
              {errors.contact_person_name && (
                <p className="text-danger">
                  {errors.contact_person_name.message}
                </p>
              )}
              {err && <p className="text-danger">{err?.contact_person_name}</p>}
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
                htmlFor="contact-email"
                className="form-label fw-bold text-warning"
              >
                Contact Email
              </label>
              <input
                type="email"
                className="form-control"
                {...register('contact_person_email', {
                  required: 'Contact email is Required',
                })}
                onBlur={(e) =>
                  handleUnique('contact_person_email', e.target.value)
                }
                id="contact-email"
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
              <label htmlFor="city" className="form-label fw-bold text-warning">
                City
              </label>
              <input
                type="text"
                className="form-control"
                {...register('city', {
                  required: 'City is Required',
                })}
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
                id="contact-phone"
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
              <label htmlFor="zip" className="form-label fw-bold text-warning">
                Zip
              </label>
              <input
                type="text"
                className="form-control"
                {...register('zip', {
                  required: 'Zip is Required',
                })}
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
                {...register('legal_identity_number', {
                  required: 'Legal Identity number is Required',
                  minLength: {
                    value: 2,
                    message:
                      'Legal entity number must have at least 2 characters',
                  },
                })}
                onBlur={(e) =>
                  handleUnique('legal_identity_number', e.target.value)
                }
                id="legal-entity-number"
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
                className="btn-orange float-end create-create-btn"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
