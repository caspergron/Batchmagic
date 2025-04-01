import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import DropDown from '../../../../components/DropDown';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';

const Create = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [gourps, setGroups] = useState([]);
  const [group, setGroup] = useState();
  const [supplier_id, setSupplier_id] = useState();
  const { err, setErr } = useState({});
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const getSuppliers = async () => {
      try {
        const res = await axiosPrivate.get('/suppliers', {
          signal: controller.signal,
        });
        if (res.status === 200) {
          setSuppliers(res?.data?.data);
          setGroups(
            [
              {
                id: 1,
                name: 'With sugar',
              },
              {
                id: 2,
                name: 'Without sugar',
              },
              {
                id: 3,
                name: 'Wrapped',
              },
              {
                id: 4,
                name: 'Other',
              }
            ]
          );
        }
      } catch (err) {
        <ErrorModal value={true} />;
      }
    };
    getSuppliers();
    return () => {
      controller.abort();
    };
  }, []);

  const handleDropDown = (supplier) => {
    setSupplier_id(supplier?.id);
  };

  const handleDropDownGroup = (gourp) => {
    setGroup(gourp?.name);
  }

  const handleUnique = async (nameProperty, value) => {
    const controller = new AbortController();
    const data = {
      property: nameProperty,
      data: {
        [nameProperty]: value,
      },
    };

    try {
      const res = await axiosPrivate.post('/unique-product', data, {
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

  const handleAddProduct = async (data, e) => {
    data.supplier_id = supplier_id;
    data.group = group;
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post('/product', data, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate('/dashboard/product');
      }
    } catch (err) {
      setLoading(false);
      setErr(err.response.data.errors);
    }
  };
  return (
    <div>
      <div>
        <Link to="/dashboard/product" className="d-flex flex-column">
          <img
            className="align-self-end page-close create-page-close-position"
            src={close}
            alt=""
          />
        </Link>
        <h1 className="text-center create-header create-header-my">
          Create a Product
        </h1>
        <form onSubmit={handleSubmit(handleAddProduct)}>
          <div className="row p-5 create-data-container create-data-info">
            <div className="col-md-6 py-3 px-80">
              <label htmlFor="name" className="form-label fw-bold text-warning">
                Name
              </label>
              <input
                type="text"
                className="form-control rounded-0"
                {...register('name', {
                  required: 'Name is Required',
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
                htmlFor="supplier"
                className="form-label fw-bold text-warning"
              >
                Supplier
              </label>
              <DropDown
                handleDropDown={handleDropDown}
                dropDownValue={suppliers}
              />
            </div>

            <div className="col-md-6 py-3 px-80">
              <label
                htmlFor="external-id-ref"
                className="form-label fw-bold text-warning"
              >
                External ID ref
              </label>
              <input
                type="text"
                {...register('external_ref', {
                  required: 'external_ref is Required',
                })}
                onBlur={(e) => handleUnique('external_ref', e.target.value)}
                className="form-control rounded-0"
                id="external-id-ref"
                placeholder="External ID ref"
              />
              {errors.external_ref && (
                <p className="text-danger">{errors.external_ref.message}</p>
              )}
              {err && <p className="text-danger">{err?.external_ref}</p>}
            </div>
            <div className="col-md-6 py-3 px-80">
              <label
                htmlFor="supplier"
                className="form-label fw-bold text-warning"
              >
                Group
              </label>
              <DropDown
                handleDropDown={handleDropDownGroup}
                dropDownValue={gourps}
              />
            </div>

            {supplier_id && (
              <div className="col-md-12 p-3">
                <button
                  type="submit"
                  disabled={
                    errors?.external_ref?.message || errors?.name?.message
                  }
                  className="btn btn-orange float-end create-create-btn"
                >
                  Create
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
