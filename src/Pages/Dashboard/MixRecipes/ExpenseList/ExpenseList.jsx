import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../../../assets/style/CommonCSS/List.css';
import edit from '../../../../assets/Logo/actions/edit.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.jsx';
import DataTables from '../../../../components/DataTablesNew';
import close from '../../../../assets/Logo/actions/cross.svg';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const columns = (handleDelete, handleEdit) => [
  {
    name: 'Name of Expenses',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Cost',
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

const ExpenseList = () => {
  const { register /* , reset */ } = useForm();
  const [recipeExpenses, setRecipeExpenses] = useState([]);
  const [expense, setExpense] = useState('');
  const [price, setPrice] = useState('');
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();
  const navigate = useNavigate();

  const [err, setErr] = useState({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getRecipeExpenses = async () => {
      try {
        const response = await axiosPrivate.get(
          `mix-recipe-expense/all/${id}?is_list=true`,
          {
            signal: controller.signal,
          },
        );
        if (isMounted) {
          setRecipeExpenses(response.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return error;
        } else {
          return 'Download error: ' + error.message;
        }
      }
    };

    getRecipeExpenses();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleDelete = async (expenseId) => {
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.delete(
        `/mix-recipe-expense/${expenseId}`,
        {
          signal: controller.signal,
        },
      );
      if (response.status === 200) {
        const updatedData = await axiosPrivate.get(
          `mix-recipe-expense/all/${id}?is_list=false`,
          {
            signal: controller.signal,
          },
        );
        setRecipeExpenses(updatedData.data);
        navigate(`/dashboard/mix-recipes/expenselist/${id}`);
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
          `mix-recipe-expense/${currentExpenseId}`,
          {
            name: expense,
            batch_template_id: id,
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
          `mix-recipe-expense`,
          {
            name: expense,
            batch_template_id: id,
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
          `mix-recipe-expense/all/${id}?is_list=false`,
          {
            signal: controller.signal,
          },
        );
        setRecipeExpenses(updatedData.data);
        setIsEditMode(false);
        setCurrentExpenseId(null);
        setExpense('');
        setPrice('');
        setErr({});
        navigate(`/dashboard/mix-recipes/expenselist/${id}`);

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
    setCurrentExpenseId(recipe.id);
    setExpense(recipe.name);
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

  const memoizedData = useMemo(() => recipeExpenses.data, [recipeExpenses]);

  return (
    <div>
      <Link to="/dashboard/mix-recipes" className="d-flex flex-column">
        <img
          className="align-self-end page-close edit-page-close-position"
          src={close}
          alt=""
        />
      </Link>
      <h1 className="text-center my-64 list-header">Expenses</h1>
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
                {isEditMode ? 'Update Expense' : 'Add an Expense'}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setIsEditMode(false);
                  setCurrentExpenseId(null);
                  setExpense('');
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
                  htmlFor="expense"
                  className="form-label fw-bold text-warning"
                >
                  Expense Name
                </label>
                <input
                  type="text"
                  {...register('expense')}
                  value={expense}
                  name="expense"
                  className="form-control rounded-0"
                  onChange={(e) => setExpense(e.target.value)}
                  id="expense"
                  placeholder="Name"
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
                  placeholder="price"
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

export default ExpenseList;
