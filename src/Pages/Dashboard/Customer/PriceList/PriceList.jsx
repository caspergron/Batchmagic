import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../../../assets/style/CommonCSS/List.css';
import edit from '../../../../assets/Logo/actions/edit.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.jsx';
import DataTables from '../../../../components/DataTablesNew';
import DropDown from '../../../../components/DropDown';
import close from '../../../../assets/Logo/actions/cross.svg';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const columns = (handleDelete, handleEdit) => [
  {
    name: 'Mix Recipes',
    selector: (row) => row?.batch_template?.name,
    sortable: true,
  },
  {
    name: 'Prices',
    selector: (row) => row.price,
    sortable: true,
  },
  {
    name: 'Actions',
    cell: (row) => (
      <div className="action-container">
        <button
          className="btn btn-action-customized"
          onClick={() => handleEdit(row)}
          // data-bs-toggle="modal"
          // data-bs-target="#staticBackdrop"
        >
          <img src={edit} className="edit-action" alt="" />
        </button>
        <button
          className="btn btn-action-customized"
          onClick={() => handleDelete(row.id)}
        >
          <img src={remove} className="edit-action" alt="" />
        </button>
      </div>
    ),
  },
];

const PriceList = () => {
  const { register /* , reset */ } = useForm();
  const [batchTemplates, setBatchTemplates] = useState([]);
  const [recipePrices, setRecipePrices] = useState([]);
  const [batchTemplateId, setBatchTemplateId] = useState();
  const [price, setPrice] = useState('');
  const [isClear, setIsClear] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [mixRecipe, setMixRecipe] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const navigate = useNavigate();

  const [err, setErr] = useState({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBatchTemplates = async () => {
      try {
        const response = await axiosPrivate.get(`/batch-templates`, {
          signal: controller.signal,
        });

        if (isMounted) {
          setBatchTemplates(response.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return error;
        } else {
          return 'Download error: ' + error.message;
        }
      }
    };

    const getRecipePrices = async () => {
      try {
        const response = await axiosPrivate.get(
          `mix-recipe-price/all/${id}?is_list=true`,
          {
            signal: controller.signal,
          },
        );
        if (isMounted) {
          setRecipePrices(response.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return error;
        } else {
          return 'Download error: ' + error.message;
        }
      }
    };

    getRecipePrices();
    getBatchTemplates();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleDropDown = (batchTemplate) => {
    setBatchTemplateId(batchTemplate?.id);
    // document.getElementById('price').value = '';
    setErr({});
  };

  const handleDelete = async (priceId) => {
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.delete(
        `/mix-recipe-price/${priceId}`,
        {
          signal: controller.signal,
        },
      );
      if (response.status === 200) {
        const updatedData = await axiosPrivate.get(
          `mix-recipe-price/all/${id}?is_list=false`,
          {
            signal: controller.signal,
          },
        );
        setRecipePrices(updatedData.data);
        navigate(`/dashboard/customers/pricelist/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    try {
      let response;
      if (isEditMode) {
        response = await axiosPrivate.put(
          `mix-recipe-price/${currentRecipeId}`,
          {
            customer_id: id,
            batch_template_id: batchTemplateId,
            price: price,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          },
        );
      } else {
        response = await axiosPrivate.post(
          `mix-recipe-price`,
          {
            customer_id: id,
            batch_template_id: batchTemplateId,
            price: price,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          },
        );
      }

      if (
        (response.status === 201 || response.status === 200) &&
        response.data?.success === true
      ) {
        const updatedData = await axiosPrivate.get(
          `mix-recipe-price/all/${id}?is_list=false`,
          {
            signal: controller.signal,
          },
        );
        setRecipePrices(updatedData.data);
        setIsEditMode(false);
        setCurrentRecipeId(null);
        setPrice('');
        // reset({ price: '' });
        setIsClear(true);
        setTimeout(() => {
          setIsClear(false);
        }, 10);
        setErr({});
        navigate(`/dashboard/customers/pricelist/${id}`);

        // Programmatically dismiss the modal by manipulating the DOM
        const modalElement = document.getElementById('staticBackdrop');
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
        const backdrop = document.getElementsByClassName('modal-backdrop')[0];
        if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      } else {
        setErr(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (recipe) => {
    setIsEditMode(true);
    setCurrentRecipeId(recipe.id);
    setMixRecipe(recipe.batch_template);
    setBatchTemplateId(recipe.batch_template_id);
    setPrice(recipe.price);
    openModal();
  };

  const openModal = () => {
    const modalElement = document.getElementById('staticBackdrop');
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    modalElement.removeAttribute('aria-hidden');
    modalElement.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  };

  const memoizedData = useMemo(() => recipePrices.data, [recipePrices]);

  return (
    <div>
      <Link to="/dashboard/customers" className="d-flex flex-column">
        <img
          className="align-self-end page-close edit-page-close-position"
          src={close}
          alt=""
        />
      </Link>
      <h1 className="text-center my-64 list-header">Prices</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '30px',
          marginBottom: '8px',
        }}
      >
        <button
          type="button"
          className="btn list-add-btn"
          onClick={() => {
            setIsClear(true);
            setTimeout(() => {
              setIsClear(false);
            }, 10);
            openModal();
          }}
        >
          Add
        </button>
      </div>
      <DataTables
        columns={columns(handleDelete, handleEdit)}
        data={memoizedData}
        header={''}
        navigation={''}
        searchBar={false}
        searchPlaceholder={''}
      />
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
              <h1 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">
                {isEditMode ? 'Update Mix' : 'Add Mix Recipes'}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setIsEditMode(false);
                  setCurrentRecipeId(null);
                  setPrice('');
                  // reset({ price: '' });
                  setErr({});

                  const modalElement =
                    document.getElementById('staticBackdrop');
                  modalElement.classList.remove('show');
                  modalElement.style.display = 'none';
                  modalElement.setAttribute('aria-hidden', 'true');
                  modalElement.removeAttribute('aria-modal');
                  const backdrop =
                    document.getElementsByClassName('modal-backdrop')[0];
                  if (backdrop) {
                    backdrop.parentNode.removeChild(backdrop);
                  }
                  document.body.classList.remove('modal-open');
                  document.body.style.overflow = '';
                  document.body.style.paddingRight = '';
                }}
              ></button>
            </div>

            <div className="modal-body">
              <div className="px-5 py-3">
                <label
                  htmlFor="product"
                  className="form-label fw-bold text-warning"
                >
                  Select Mix Recipe
                </label>
                <DropDown
                  isClear={isClear}
                  handleDropDown={handleDropDown}
                  dropDownValue={batchTemplates?.data}
                  defaultValue={mixRecipe}
                  placeholderUpdated="Select Mix Recipe"
                />
              </div>

              <div className="px-5 py-3">
                <label
                  htmlFor="price"
                  className="form-label fw-bold text-warning"
                >
                  Price
                </label>
                <input
                  type="number"
                  {...register('price')}
                  step="5"
                  value={price}
                  name="price"
                  className="form-control rounded-0"
                  onChange={(e) => setPrice(e.target.value)}
                  id="price"
                  placeholder="Price"
                />
              </div>
              {err && <p className="text-danger">{err?.message}</p>}
            </div>

            <div className="d-flex justify-content-center p-5">
              <button
                id="dismissModalBtn"
                onClick={handleFormSubmit}
                className="btn btn-orange float-center create-create-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
