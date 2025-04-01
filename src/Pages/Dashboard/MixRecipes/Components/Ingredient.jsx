import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import close from '../../../../assets/Logo/actions/cross.svg';
import useAuth from '../../../../hooks/useAuth';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import ErrorModal from '../../../../components/ErrorModal';
import CKEditor from 'react-ckeditor-component';

// Rest of the code...
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Ingredient = ({
  isOpen = true,
  onIngredientClose,
  batchTemplateId,
  children,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [err, setErr] = useState({});
  const { setLoading } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [ingredients, setIngredients] = useState(null);

  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    const controller = new AbortController();
    const getIngredients = async () => {
      try {
        const res = await axiosPrivate.get(
          `/batch-template-ingredient/${batchTemplateId}`,
          {
            signal: controller.signal,
          },
        );
        if (res.status === 200) {
          setIngredients(res?.data?.data);
        }
      } catch (err) {
        <ErrorModal />;
      }
    };

    getIngredients();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (ingredients) {
      setValue('ingredients', ingredients?.ingredients);
      setValue('energy_kj', ingredients?.energy_kj);
      setValue('of_which_sugars', ingredients?.of_which_sugars);
      setValue('energy_kcal', ingredients?.energy_kcal);
      setValue('protein', ingredients?.protein);
      setValue('fat', ingredients?.fat);
      setValue('of_which_saturated', ingredients?.of_which_saturated);
      setValue('carbohydrates', ingredients?.carbohydrates);
      setValue('salt', ingredients?.salt);
    }
  }, [ingredients, setValue]);

  const handleAddIngredients = async (data, e) => {
    console.log(data);
    data = { ...data, batch_template_id: batchTemplateId };
    const controller = new AbortController();
    e.preventDefault();
    setLoading(true);

    if (ingredients) {
      try {
        const res = await axiosPrivate.put(
          `/batch-template-ingredient/${ingredients.id}`,
          data,
          {
            signal: controller.signal,
          },
        );

        if (res.status == 200) {
          setLoading(false);
          controller.abort();
        }
      } catch (err) {
        setLoading(false);

        setErr(err.response.data.errors);
      }
    } else {
      try {
        const res = await axiosPrivate.post(
          '/batch-template-ingredient',
          data,
          {
            signal: controller.signal,
          },
        );

        if (res.status == 200) {
          setLoading(false);
          controller.abort();
        }
      } catch (err) {
        setLoading(false);

        setErr(err.response.data.errors);
      }
    }
  };

  const handleEditorChange = (e) => {
    const newContent = e.editor.getData();
    setValue('ingredients', newContent);
  };

  return (
    <div className="modal-overlay-recipes">
      <div className="modal-body-recipes modal-body-recipes-ingredient">
        <div className="d-flex justify-content-between modal-header-recipes list-header">
          <p className="fw-bold fs-6">Add Ingredients</p>

          <img
            onClick={() => {
              onIngredientClose();
            }}
            className="modal-close"
            src={close}
            alt=""
          />
        </div>
        <hr className="my-0" />
        <div className="modal-content-recipes">
          {children}
          <form onSubmit={handleSubmit(handleAddIngredients)}>
            <div className="row p-2">
              <div className="col-md-12 pt-2">
                <label
                  htmlFor="ingredient"
                  className="form-label fw-bold text-warning"
                >
                  Ingredients
                </label>

                <CKEditor
                  activeClass="p10"
                  content={ingredients?.ingredients}
                  {...register('ingredients', {
                    required: 'Ingredient is required',
                  })}
                  events={{
                    blur: (e) => handleEditorChange(e),
                    afterPaste: (e) => handleEditorChange(e),
                    change: (e) => handleEditorChange(e),
                  }}
                />
                {errors.ingredients && (
                  <p className="text-danger">{errors.ingredients.message}</p>
                )}
                {err && <p className="text-danger">{err?.ingredients}</p>}
              </div>

              <div className="col-md-6 py-3">
                <label
                  htmlFor="energy-kj"
                  className="form-label fw-bold text-warning"
                >
                  Energy (kj)
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('energy_kj', {
                    required: 'Energy(kj) is required',
                  })}
                  id="energy-kj"
                  defaultValue={ingredients?.energy_kj}
                />
                {errors.energy_kj && (
                  <p className="text-danger">{errors.energy_kj.message}</p>
                )}
              </div>
              <div className="col-md-6 py-3">
                <label
                  htmlFor="sugar"
                  className="form-label fw-bold text-warning"
                >
                  Of which sugars
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('of_which_sugars', {
                    required: 'Of which sugar is required',
                  })}
                  id="sugar"
                  defaultValue={ingredients?.of_which_sugars}
                />
                {errors.of_which_sugars && (
                  <p className="text-danger">
                    {errors.of_which_sugars.message}
                  </p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="energy-kcal"
                  className="form-label fw-bold text-warning"
                >
                  Energy (kcal)
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('energy_kcal', {
                    required: 'Energy(kcal) is required',
                  })}
                  id="energy-kcal"
                  defaultValue={ingredients?.energy_kcal}
                />
                {errors.energy_kcal && (
                  <p className="text-danger">{errors.energy_kcal.message}</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="protein"
                  className="form-label fw-bold text-warning"
                >
                  Protein
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('protein', {
                    required: 'Protein is required',
                  })}
                  id="protein"
                  defaultValue={ingredients?.protein}
                />
                {errors.protein && (
                  <p className="text-danger">{errors.protein.message}</p>
                )}
              </div>
              <div className="col-md-6 py-3">
                <label
                  htmlFor="fat"
                  className="form-label fw-bold text-warning"
                >
                  Fat
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('fat', {
                    required: 'Fat is required',
                  })}
                  id="fat"
                  defaultValue={ingredients?.fat}
                />
                {errors.fat && (
                  <p className="text-danger">{errors.fat.message}</p>
                )}
              </div>
              <div className="col-md-6 py-3">
                <label
                  htmlFor="saturated"
                  className="form-label fw-bold text-warning"
                >
                  Of which saturated
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('of_which_saturated', {
                    required: 'Of which saturated is required',
                  })}
                  id="saturated"
                  defaultValue={ingredients?.of_which_saturated}
                />
                {errors.of_which_saturated && (
                  <p className="text-danger">
                    {errors.of_which_saturated.message}
                  </p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="carbohydrates"
                  className="form-label fw-bold text-warning"
                >
                  Carbohydrates
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('carbohydrates', {
                    required: 'Carbohydrates is required',
                  })}
                  id="carbohydrates"
                  defaultValue={ingredients?.carbohydrates}
                />
                {errors.carbohydrates && (
                  <p className="text-danger">{errors.carbohydrates.message}</p>
                )}
              </div>
              <div className="col-md-6">
                <label
                  htmlFor="salt"
                  className="form-label fw-bold text-warning"
                >
                  Salt
                </label>
                <input
                  type="text"
                  className="form-control"
                  {...register('salt', {
                    required: 'Salt is required',
                  })}
                  id="salt"
                  defaultValue={ingredients?.salt}
                />
                {errors.salt && (
                  <p className="text-danger">{errors.salt.message}</p>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center pt-3">
              <button
                type="submit"
                className="btn btn-orange float-center create-create-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ingredient;

Ingredient.propTypes = {
  isOpen: PropTypes.bool,
  onIngredientClose: PropTypes.func.isRequired,
  batchTemplateId: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
