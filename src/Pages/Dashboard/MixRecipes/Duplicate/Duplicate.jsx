import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DropDown from '../../../../components/DropDown';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { ToastContainer, toast } from 'react-toastify';
import { isEmpty } from '../../../../components/utils';
import ErrorModal from '../../../../components/ErrorModal';
import close from '../../../../assets/Logo/actions/cross.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import edit from '../../../../assets/Logo/actions/edit_small.svg';
import Loader from '../../../../components/Loader';

const Duplicate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm();
  const [batchTemplate, setBatchTemplate] = useState({});
  const [product_id, setProduct_id] = useState({});
  const [product_name, setProduct_name] = useState({});
  const [product, setProduct] = useState([]);
  const [amount, setAmount] = useState({});
  const [total_weight, setTotal_weight] = useState(0);
  const [weight, setWeight] = useState({});
  const [productSubmitDisabled, setProductSubmitDisabled] = useState(true);
  const [nameChanged, setNameChanged] = useState(true);
  const [refChanged, setRefChanged] = useState(true);
  /*  */
  const [editProduct, setEditProduct] = useState([]);
  const [productName, setProductName] = useState([]);
  const [selectProduct, setSelectProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  /*  */
  const { err, setErr } = useState({});
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [batchProduct, setBatchProduct] = useState([]);
  let total_weight_count = 0;
  const params = useParams();

  const [isClear, setIsClear] = useState(false);

  //get product list
  useEffect(() => {
    const controller = new AbortController();
    const getProducts = async () => {
      try {
        const res = await axiosPrivate.get('/products', {
          signal: controller.signal,
        });

        if (res.status === 200) {
          setProduct(res?.data?.data);
          setAllProduct(res?.data?.data);
        }
      } catch (err) {
        <ErrorModal />;
      }
    };
    getProducts();
    return () => {
      controller.abort();
    };
  }, []);

  //submit button enable/disable
  useEffect(() => {
    parseFloat(weight) > 0 && parseInt(amount) > 0 && product_name
      ? setProductSubmitDisabled(false)
      : setProductSubmitDisabled(true);
  }, [weight, amount, product_name]);

  //get batch template
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
          setBatchProduct(
            response.data.data.batch_products.map((item) => {
              return {
                product_id: item.product_id,
                product_name: item.product.name,
                weight: item.weight,
                amount: item.amount,
              };
            }),
          );

          const productName = response.data.data.batch_products.map(
            (data) => data?.product.name,
          );

          setProductName(productName);

          setTotal_weight(response.data.data.total_weight);
          handleUnique('name', response.data.data?.name);
          handleUnique('external_ref', response.data.data?.external_ref);
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

  /*  */
  const handleDeletedProduct = (name, id) => {
    console.log(name, id);
  };

  /*  */
  const handleProduct = () => {
    setSelectProduct(false);
    // setEditProduct([]);
    const sortedProduct = product?.filter(
      (data) => !productName.includes(data.name),
    );

    setProduct(sortedProduct);

    /*  */
    handleDeletedProduct();

    /*  */
    setIsClear(true);
    // Reset form fields
    reset({
      product_name: '',
      weight: '',
      amount: '',
      product_id: '',
    });
  };

  /* edit products */
  useEffect(() => {
    if (editProduct.length > 0) {
      setValue('product_id', editProduct[0]?.product_id);
      setValue('product_name', editProduct[0]?.product_name);
      setValue('weight', editProduct[0]?.weight);
      setValue('amount', editProduct[0]?.amount);
    }
  }, [editProduct, setValue]);

  const handleEditProduct = (productId) => {
    setIsClear(false);
    const editProduct = batchProduct.filter((l) => l.product_id === productId);

    setEditProduct(editProduct);
    setSelectProduct(true);
    /* setValue */
    setProduct_id(editProduct[0]?.product_id);
    setProduct_name(editProduct[0]?.product_name);
    setWeight(editProduct[0]?.weight);
    setAmount(editProduct[0]?.amount);
    /*  */

    // setProduct(allProduct);
  };

  const handleAddBatchTemplete = async (data, e) => {
    const makeData = {
      name: data.name,
      products: batchProduct,
      total_weight: Number(total_weight.toFixed(2)),
      external_ref: data.external_ref,
    };

    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPrivate.post('/batch-template', makeData, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setLoading(false);
        controller.abort();
        navigate('/dashboard/mix-recipes');
      }
    } catch (err) {
      setLoading(false);
      <ErrorModal />;
      toast.error(
        err.response.data.errors?.['products'][0] ||
          'Unable to create batch template',
      );
      setErr(err.response.data.errors);
    }
  };

  const handleDropDown = (product) => {
    setProduct_id(product?.id);
    setProduct_name(product?.name);
  };

  const handleProductDelete = (name, weight, id) => {
    const updatedBatchProduct = batchProduct.filter(
      (item) => item.product_name !== name,
    );

    setBatchProduct(updatedBatchProduct);
    handleTotalWeight(weight);

    const updatedProduct = product;
    updatedProduct.push({ id: id, name: name });
    setProduct(updatedProduct);

    /*  */
    const deletedProduct = updatedBatchProduct.map((item) => item.product_name);
    setProductName(deletedProduct);
  };

  const handleAmount = (e) => {
    setAmount(Number(parseInt(e.target.value)));
  };

  const handleWeight = (e) => {
    setWeight(Number(parseFloat(e.target.value).toFixed(2)));
  };

  const handleAddBatchProdct = () => {
    if (editProduct.length > 0) {
      setBatchProduct((current) =>
        current.map((obj) => {
          if (obj.product_id === editProduct[0]?.product_id) {
            return {
              ...obj,
              product_name: product_name,
              weight: weight,
              amount: amount,
            };
          }
          return obj;
        }),
      );
      setEditProduct([]);
      if (!(editProduct[0].weight === weight)) {
        if (editProduct[0].weight < weight) {
          const weightAdd = weight - editProduct[0]?.weight;
          setWeight(weightAdd);
          handleTotalWeight('', weightAdd);
        } else if (editProduct[0].weight > weight) {
          const weightRemove = editProduct[0]?.weight - weight;
          setWeight(weightRemove);
          handleTotalWeight(weightRemove);
        }
      }
    } else {
      setBatchProduct((batchProduct) => [
        ...batchProduct,
        {
          product_id: product_id,
          product_name: product_name,
          weight: weight,
          amount: amount,
        },
      ]);
      handleTotalWeight();

      /*  */
    }

    setProduct_name(product?.name);
    //update product list exclude selected product
    const updatedProduct = product.filter((item) => item.id !== product_id);
    setProduct(updatedProduct);
    setAmount(0);
    setWeight(0);

    setIsClear(true);
    // Reset form fields
    reset({
      product_name: '',
      weight: '',
      amount: '',
      product_id: '',
    });

    setTimeout(() => {
      setIsClear(false);
    }, 10);
  };

  const handleTotalWeight = (removWight = 0, weightAdd = 0) => {
    total_weight_count =
      parseFloat(removWight) > 0
        ? total_weight_count - parseFloat(removWight)
        : total_weight_count + parseFloat(selectProduct ? weightAdd : weight);
    setTotal_weight((total_weight) =>
      parseFloat(removWight) > 0
        ? total_weight - parseFloat(removWight)
        : total_weight + total_weight_count,
    );
  };

  const handleUnique = async (nameProperty, value) => {
    if (nameProperty == 'name') {
      setNameChanged(false);
    }
    if (nameProperty == 'external_ref') {
      setRefChanged(false);
    }

    const controller = new AbortController();
    const data = {
      property: nameProperty,
      data: {
        [nameProperty]: value,
      },
    };

    if (data.name === batchTemplate?.name) {
      setError(nameProperty, {
        type: 'manual',
        message: `The ${nameProperty} is not unique`,
      });
    }

    try {
      const res = await axiosPrivate.post('/unique-batch-template', data, {
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
      {isEmpty(batchTemplate) ? (
        <Loader />
      ) : (
        <div>
          <div>
            <Link to="/dashboard/mix-recipes" className="d-flex flex-column">
              <img
                className="align-self-end page-close edit-page-close-position"
                src={close}
                alt=""
              />
            </Link>
            <h1 className="text-center edit-header edit-header-my">
              Create Duplicate Recipes
            </h1>

            <form onSubmit={handleSubmit(handleAddBatchTemplete)}>
              <div className="mixrecipe-create">
                <div className="row p-5 create-data-container">
                  <div className="col-md-4">
                    <div className="row create-data-info">
                      <div className="col-md-9">
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
                            minLength: {
                              value: 1,
                              message: 'Name is required',
                            },
                          })}
                          onChange={(e) => handleUnique('name', e.target.value)}
                          id="name"
                          placeholder="Name"
                          defaultValue={batchTemplate?.name}
                        />
                        {errors.name && (
                          <p className="text-danger">{errors.name.message}</p>
                        )}
                        {err && <p className="text-danger">{err?.name[0]}</p>}
                      </div>

                      <div className="col-md-9 py-3">
                        <label
                          htmlFor="total-weight"
                          className="form-label fw-bold text-warning"
                        >
                          Total weight (g)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={Number(total_weight.toFixed(2))}
                          {...register('total_weight')}
                          id="total-weight"
                          placeholder="Total weight "
                          defaultValue={batchTemplate?.total_weight}
                          readOnly
                        />
                      </div>
                      <div className="col-md-9">
                        <label
                          htmlFor="external-ref-id"
                          className="form-label fw-bold text-warning"
                        >
                          External ref ID
                        </label>
                        <input
                          type="text"
                          {...register('external_ref', {
                            required:
                              isEmpty(batchProduct) &&
                              'External ref ID is Required',
                          })}
                          onChange={(e) =>
                            handleUnique('external_ref', e.target.value)
                          }
                          className="form-control"
                          id="external-ref-id"
                          placeholder="External ref ID"
                          defaultValue={batchTemplate?.external_ref}
                        />
                        {errors.external_ref && (
                          <p className="text-danger">
                            {errors.external_ref.message}
                          </p>
                        )}
                        {err && (
                          <p className="text-danger">{err?.external_ref}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8 pb-5">
                    <a
                      className="btn text-white float-end list-add-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                      onClick={handleProduct}
                    >
                      ADD A PRODUCT
                    </a>

                    <div
                      className="modal fade"
                      id="staticBackdrop"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header px-4">
                            <h1
                              className="modal-title fs-5"
                              id="staticBackdropLabel"
                            >
                              {' '}
                              Add a New Product
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="px-5 py-3">
                              <label
                                htmlFor="product"
                                className="form-label fw-bold text-warning"
                              >
                                Product
                              </label>
                              <DropDown
                                isClear={isClear}
                                handleDropDown={handleDropDown}
                                dropDownValue={
                                  selectProduct ? allProduct : product
                                }
                                isDisabled={selectProduct}
                                defaultValue={
                                  selectProduct
                                    ? allProduct.find(
                                        (products) =>
                                          products.id ===
                                          editProduct[0]?.product_id,
                                      )
                                    : product.find(
                                        (products) =>
                                          products.id ===
                                          editProduct[0]?.product_id,
                                      )
                                }
                              />
                            </div>
                            <div className="px-5">
                              <label
                                htmlFor="weight"
                                className="form-label fw-bold text-warning"
                              >
                                Weight (g)
                              </label>
                              <input
                                type="number"
                                {...register('weight')}
                                name="weight"
                                step="0.01"
                                min={0}
                                className="form-control"
                                onBlur={handleWeight}
                                id="weight"
                                placeholder="Weight"
                                // defaultValue={editProduct?.weight}
                              />
                            </div>
                            <div className="px-5 py-3">
                              <label
                                htmlFor="amount"
                                className="form-label fw-bold text-warning"
                              >
                                Amount
                              </label>
                              <input
                                type="number"
                                step="1"
                                min={1}
                                {...register('amount')}
                                name="amount"
                                className="form-control"
                                onBlur={handleAmount}
                                id="amount"
                                placeholder="Amount"
                                // defaultValue={editProduct?.amount}
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-center p-5">
                            <button
                              type="button"
                              data-bs-dismiss="modal"
                              onClick={handleAddBatchProdct}
                              className="btn float-center create-create-btn"
                              disabled={productSubmitDisabled}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <table className="table table-mt">
                      <thead>
                        <tr>
                          <th scope="col" className="text-recipe">
                            <b>Product name</b>
                          </th>
                          <th scope="col" className="text-recipe">
                            <b>Weight (g)</b>
                          </th>
                          <th scope="col" className="text-recipe">
                            <b>Amount</b>
                          </th>
                          <th scope="col" className="text-recipe">
                            <b>Actions</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchProduct?.map((item) => {
                          return (
                            <tr key={item?.product_id}>
                              <td scope="row">{item?.product_name}</td>
                              <td>{item?.weight}</td>
                              <td>{item?.amount}</td>
                              <td>
                                <div className="action-container">
                                  <a
                                    onClick={() => {
                                      handleProductDelete(
                                        item?.product_name,
                                        item?.weight,
                                        item?.product_id,
                                      );
                                      handleDeletedProduct(
                                        item?.product_name,
                                        item?.product_id,
                                      );
                                    }}
                                    cursor="cursor"
                                  >
                                    <img
                                      src={remove}
                                      className="delete-action"
                                      alt=""
                                    />
                                  </a>
                                  <a
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdrop"
                                    onClick={() => {
                                      handleEditProduct(item?.product_id);
                                    }}
                                    cursor="cursor"
                                  >
                                    <img
                                      src={edit}
                                      className="edit-action"
                                      alt=""
                                    />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-5 mb-3 p-0 btn-customized">
                    <button
                      type="submit"
                      disabled={
                        errors?.external_ref?.message ||
                        errors?.name?.message ||
                        isEmpty(batchProduct) ||
                        nameChanged ||
                        refChanged
                      }
                      className="btn float-end edit-update-btn submit-mt"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default Duplicate;
