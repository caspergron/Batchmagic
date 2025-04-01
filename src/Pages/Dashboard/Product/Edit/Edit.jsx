import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import Loader from '../../../../components/Loader';
import { isEmpty } from '../../../../components/utils';
import close from '../../../../assets/Logo/actions/cross.svg';
import DropDown from '../../../../components/DropDown';
import ErrorModal from '../../../../components/ErrorModal';
import '../../../../assets/style/CommonCSS/Edit.css';

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();
  const { err, setErr } = useState({});
  const [product, setProduct] = useState();
  const [gourps, setGroups] = useState([]);
  const [group, setGroup] = useState();
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState();
  const { setLoading } = useAuth();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getProduct = async () => {
      try {
        const res = await axiosPrivate.get(`/product/${params.id}`, {
          signal: controller.signal,
        });
        if (isMounted && res.status === 200) {
          setLoading(false);
          controller.abort();
          setProduct(res.data.data);
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
        setLoading(false);
        setErr(err.response.data.errors);
      }
    };
    getProduct();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('external_ref_id', product.external_ref);
      setValue('supplier', product.supplier_id);
    }
  }, [product, setValue]);

  useEffect(() => {
    const controller = new AbortController();
    const getSuppliers = async () => {
      try {
        const res = await axiosPrivate.get('/suppliers', {
          signal: controller.signal,
        });
        if (res.status === 200) {
          setSuppliers(res?.data?.data);
        }
      } catch (err) {
        <ErrorModal />;
      }
    };

    getSuppliers();
    return () => {
      controller.abort();
    };
  }, []);

  const handleDropDown = (supplier) => {
    setSupplierId(supplier?.id);
  };

  const handleDropDownGroup = (gourp) => {
    setGroup(gourp?.name);
  }


  const makeData = (data) => {
    const newData = {};
    if (data.name && product?.name !== data.name) {
      newData.name = data.name;
    }

    if (data.supplier && product?.supplier_id !== supplierId) {
      newData.supplier_id = supplierId;
    }

    if (product?.group !== group) {
      newData.group = group;
    }

    if (
      data.external_ref_id &&
      product?.external_ref !== data.external_ref_id
    ) {
      newData.external_ref = data.external_ref_id;
    }

    return newData;
  };

  const handleUpdateProduct = async (data, e) => {

    const formData = makeData(data);
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.put(`/product/${params.id}`, formData, {
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

  const handleUnique = async (nameProperty, value) => {
    if (product?.[nameProperty] !== value) {
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
    } else {
      setError(nameProperty, {});
    }
  };

  return (
    <div>
      {isEmpty(product) ? (
        <Loader />
      ) : (
        <div>
          <Link to="/dashboard/product" className="d-flex flex-column">
            <img
              className="align-self-end page-close edit-page-close-position"
              src={close}
              alt=""
            />
          </Link>

          <h1 className="text-center edit-header edit-header-my">
            Update Product
          </h1>
          <form onSubmit={handleSubmit(handleUpdateProduct)}>
            <div className="row p-5 edit-data-container edit-data-info">
              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="product-name"
                  className="form-label fw-bold text-warning"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  {...register('name', {
                    required: 'Name is Required',
                  })}
                  onBlur={(e) => handleUnique('name', e.target.value)}
                  id="product-name"
                  defaultValue={product?.name}
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
                {err && <p className="text-danger">{err?.name[0]}</p>}
              </div>

              <div className="col-md-6 p-3">
                <label
                  htmlFor="supplier"
                  className="form-label fw-bold text-warning"
                >
                  Supplier
                </label>
                <DropDown
                  handleDropDown={handleDropDown}
                  dropDownValue={suppliers}
                  defaultValue={suppliers.find(
                    (supplier) => supplier.id === product?.supplier_id,
                  )}
                />
              </div>

              <div className="col-md-6 py-3 px-80">
                <label
                  htmlFor="external_ref_id"
                  className="form-label fw-bold text-warning"
                >
                  External Ref ID
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  {...register('external_ref_id', {
                    required: 'External Ref ID is Required',
                  })}
                  onBlur={(e) => handleUnique('external_ref', e.target.value)}
                  id="external_ref_id"
                  defaultValue={product?.external_ref_id}
                  placeholder="External Ref ID"
                />
              </div>

              <div className="col-md-6 p-3">
                <label
                  htmlFor="supplier"
                  className="form-label fw-bold text-warning"
                >
                  Group
                </label>
                <DropDown
                  handleDropDown={handleDropDownGroup}
                  dropDownValue={gourps}
                  defaultValue={gourps.find(
                    (gourp) => gourp.name === product?.group,
                  )}
                />
              </div>

              <div className="col-md-12 p-3">
                <button
                  type="submit"
                  disabled={errors?.name?.message}
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
};

export default Edit;
