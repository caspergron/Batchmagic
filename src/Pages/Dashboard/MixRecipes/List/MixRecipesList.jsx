import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate.jsx';
import ErrorModal from '../../../../components/ErrorModal.jsx';
import DataTables from '../../../../components/DataTablesNew';
import show from '../../../../assets/Logo/actions/show.svg';
import edit from '../../../../assets/Logo/actions/edit.svg';
import remove from '../../../../assets/Logo/actions/delete.svg';
import duplicate from '../../../../assets/Logo/actions/duplicate.svg';
import price from '../../../../assets/Logo/actions/price.svg';
import ingredient from '../../../../assets/Logo/actions/ingredient.svg';
import label from '../../../../assets/Logo/actions/label.svg';
import Ingredient from '../Components/Ingredient.jsx';
import Label from '../Components/Label.jsx';
import ErrorIcon from '@mui/icons-material/Error';

const MixRecipeList = () => {
  const [batch_template, setBatch_template] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  /*  */
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  // const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateMixRecipe, setUpdateMixRecipe] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getBatchtemplates = async () => {
      try {
        const response = await axiosPrivate.get('/batch-templates', {
          signal: controller.signal,
        });
        if (isMounted) {
          setBatch_template(response?.data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getBatchtemplates();
    return () => {
      isMounted = false;
      setUpdateMixRecipe(false);
      controller.abort();
    };
  }, [updateMixRecipe]);

  const memoizedData = useMemo(() => batch_template.data, [batch_template]);

  const showIngredientModal = (rowId) => {
    setSelectedRowId(rowId);
    setIsModalOpen(true);
  };

  const showLabelModal = (rowId) => {
    setSelectedLabelId(rowId);
    // setIsLabelOpen(true);
  };

  const closeLabelModal = () => {
    setSelectedLabelId(null);
    // setIsLabelOpen(false);
  };

  const closeIngredientModal = () => {
    setSelectedRowId(null);
    setIsModalOpen(false);
  };

  const deleteMixRecipe = async (id) => {
    const controller = new AbortController();
    try {
      const res = await axiosPrivate.delete(`/batch-template/${id}`, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        setUpdateMixRecipe(true);
        controller.abort();
      }
    } catch (err) {
      <ErrorModal />;
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Weight (g)',
      selector: (row) => row.total_weight,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Product Cost Price',
      selector: (row) =>
        row.missing_cost_price ? (
          <ErrorIcon sx={{ color: '#dc3545' }} />
        ) : (
          `${parseFloat(row.total_cost_price).toFixed(2)} DKK`
        ),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Total Cost',
      selector: (row) =>
        `${parseFloat(row.total_expense_include_cost).toFixed(2)} DKK`,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-container">
          <Link to={`/dashboard/mix-recipes/show/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={show} className="show-action" alt="" title="View" />
            </button>
          </Link>
          <Link to={`/dashboard/mix-recipes/edit/${row.id}`}>
            <button className="btn btn-action-customized">
              <img src={edit} className="edit-action" alt="" title="Edit" />
            </button>
          </Link>
          <Link to={`/dashboard/mix-recipes/duplicate/${row.id}`}>
            <button className="btn btn-action-customized">
              <img
                src={duplicate}
                className="duplicate-action"
                alt=""
                title="Duplicate"
              />
            </button>
          </Link>
          <button
            className="btn btn-action-customized"
            onClick={() => showLabelModal(row.id)}
          >
            <img
              src={label}
              className="duplicate-action"
              alt=""
              title="Labels"
            />
          </button>
          {/* <Link to={`/dashboard/mix-recipes/duplicate/${row.id}`}> */}
          <button
            className="btn btn-action-customized"
            onClick={() => showIngredientModal(row.id)}
          >
            <img
              src={ingredient}
              className="duplicate-action"
              alt=""
              title="Ingredients and nutrients"
            />
          </button>
          {/* </Link> */}
          <button
            className="btn btn-action-customized"
            onClick={() => deleteMixRecipe(row.id)}
          >
            <img src={remove} className="delete-action" alt="" title="Delete" />
          </button>
          <Link to={`/dashboard/mix-recipes/expenselist/${row.id}`}>
            <button
              className="btn btn-action-customized"
              style={{ marginLeft: '-10px' }}
            >
              <img src={price} className="edit-action" alt="" />
            </button>
          </Link>
        </div>
      ),
      grow: 2,
    },
  ];

  return (
    <div>
      <h1 className="text-center my-64 list-header">Mix Recipes</h1>
      <DataTables
        columns={columns}
        data={memoizedData}
        header={'A Recipe'}
        navigation={'/dashboard/mix-recipes/create'}
        searchPlaceholder="Search Batch Template"
      />

      {selectedLabelId && (
        <Label batchTemplateID={selectedLabelId} onClose={closeLabelModal} />
      )}

      {selectedRowId && (
        <Ingredient
          isOpen={isModalOpen}
          onIngredientClose={closeIngredientModal}
          batchTemplateId={selectedRowId}
        >
          {' '}
        </Ingredient>
      )}
    </div>
  );
};

export default MixRecipeList;
