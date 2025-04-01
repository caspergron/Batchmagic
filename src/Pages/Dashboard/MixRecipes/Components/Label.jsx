import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import close from '../../../../assets/Logo/actions/cross.svg';
import { useForm } from 'react-hook-form';
import DropDown from '../../../../components/DropDown';
import pdf from '../../../../assets/Logo/actions/pdf.svg';
import pdf_blurred from '../../../../assets/Logo/actions/pdf_blurred.svg';
import pdf_full from '../../../../assets/Logo/actions/pdf_full.svg';
import download_label from '../../../../assets/Logo/actions/download-label.svg';
import delete_label from '../../../../assets/Logo/actions/delete-label.svg';
import upload from '../../../../assets/Logo/actions/upload.svg';
import close_label from '../../../../assets/Logo/actions/close-label.svg';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import ErrorModal from '../../../../components/ErrorModal';

const Label = ({ onClose, batchTemplateID }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    resetField,
  } = useForm();

  const [labelValue, setLabelValue] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [productLabelTypes, setProductLabelTypes] = useState([]);
  const [barcodeLabelTypes, setBarcodeLabelTypes] = useState([]);
  const [currentLabel, setCurrentLabel] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const labels = [
    { id: 1, name: 'product_cu' },
    { id: 2, name: 'product_sku' },
    { id: 3, name: 'product_pallet' },
    { id: 4, name: 'barcode_cu' },
    { id: 5, name: 'barcode_sku' },
    { id: 6, name: 'barcode_pallet' },
  ];

  const productLabels = ['product_cu', 'product_sku', 'product_pallet'];
  const barcodeLabels = ['barcode_cu', 'barcode_sku', 'barcode_pallet'];

  /* add label */
  const [base64File, setBase64File] = useState('');

  /* add image */
  const [uploadImage, setUploadImage] = useState(0);
  const [base64ImageFile, setBase64ImageFile] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const controller = new AbortController();
    const getLabels = async () => {
      try {
        const res = await axiosPrivate.get(
          `/batch-template-labels/${batchTemplateID}`,
          {
            signal: controller.signal,
          },
        );
        if (res.status === 200) {
          setSelectedLabels(res?.data?.data?.batch_template_label);
          setSelectedImage(res?.data?.data?.batch_template_image);
          const label_types = res?.data?.data?.batch_template_label.map(
            (label) => label.label_type,
          );
          const product_label_types = label_types.filter((label) =>
            productLabels.includes(label),
          );
          const barcode_label_types = label_types.filter((label) =>
            barcodeLabels.includes(label),
          );

          setProductLabelTypes(product_label_types);
          setBarcodeLabelTypes(barcode_label_types);
          setCurrentLabel(labels?.find((l) => !label_types.includes(l.name)));
        }
      } catch (err) {
        <ErrorModal />;
      }
    };

    getLabels();
    return () => {
      controller.abort();
    };
  }, [refetch]);

  const makeData = (data) => {
    return {
      batch_template_id: batchTemplateID,
      label_type: labels.find((l) => l.id === labelValue).name,
      ean_number: data.ean_number,
      file: base64File,
    };
  };

  const handleDelete = async (labelType) => {
    const labelID = selectedLabels.find(
      (label) => label.label_type === labelType,
    ).id;

    if (!labelID) return;
    const controller = new AbortController();
    try {
      const res = await axiosPrivate.delete(
        `/batch-template-label/${labelID}`,
        {
          signal: controller.signal,
        },
      );

      if (res.status === 200) {
        setRefetch(!refetch);
        controller.abort();
      }
    } catch (err) {
      <ErrorModal />;
    }
  };

  /* add label */
  const uploadFile = async (e) => {
    const file = e.target.files[0];

    if (file.size > 5000000) {
      setError('file', {
        type: 'manual',
        message: 'File size should be less than 5 MB',
      });
      return;
    }

    if (
      ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(
        file.type,
      ) === false
    ) {
      setError('file', {
        type: 'manual',
        message: 'Only pdf, jpg, jpeg or png files are allowed',
      });
      return;
    }

    const base64 = await convertBase64(file);
    setBase64File(base64);
    setError('file', {});
  };

  /* add image */
  const uploadImageFile = async (e) => {
    const file = e.target.files[0];

    if (file.size > 5000000) {
      setError('file', {
        type: 'manual',
        message: 'File size should be less than 5 MB',
      });
      return;
    }

    if (
      ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) === false
    ) {
      setError('file', {
        type: 'manual',
        message: 'Only jpg, jpeg or png files are allowed',
      });
      return;
    }

    const base64 = await convertBase64(file);
    setBase64ImageFile(base64);
    setError('file', {});
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  /*  */
  const closeLabel = () => {
    setLabelValue(0);
    setBase64File('');
    setRefetch(!refetch);
  };

  const handleAddLabel = async (data, e) => {
    const formData = makeData(data);
    const controller = new AbortController();
    e.preventDefault();
    try {
      const res = await axiosPrivate.post(`/batch-template-label`, formData, {
        signal: controller.signal,
      });
      if (res.status === 200) {
        controller.abort();
        closeLabel();
        resetField('file');
        resetField('ean_number');
        resetField('label');
        setBase64File('');
      }
    } catch (err) {
      closeLabel();
      setError(err.response.data.errors);
    }
  };

  /* close image modal */
  const closeImageModal = () => {
    setUploadImage(0);
    setRefetch(!refetch);
  };

  /* submit image */
  const handleImageLabel = async (data, e) => {
    const formData = {
      image: base64ImageFile,
    };
    const controller = new AbortController();
    e.preventDefault();
    try {
      const res = await axiosPrivate.post(
        `/batch-template/image/${batchTemplateID}`,
        formData,
        {
          signal: controller.signal,
        },
      );
      if (res.status === 200) {
        controller.abort();
        closeImageModal();
        resetField('file');
        setBase64ImageFile('');
      }
    } catch (err) {
      closeImageModal();
      setError(err.response.data.errors);
    }
  };

  return (
    <div className="modal-overlay-recipes" style={{ zIndex: 1050 }}>
      <div className="modal-body-recipes modal-body-recipes-label ">
        <div className="d-flex justify-content-between align-items-baseline modal-header-recipes list-header">
          <p className="fw-bold fs-6">Label</p>
          <div className="d-flex">
            {currentLabel?.id && (
              <button
                type="button"
                className="btn btn-orange create-create-btn-customized me-2"
                style={{ paddingTop: 0, paddingBottom: 0, width: 'auto' }}
                onClick={() => setLabelValue(currentLabel?.id)}
              >
                UPLOAD
              </button>
            )}
            <img
              onClick={() => {
                onClose();
              }}
              className="modal-close"
              src={close}
              alt=""
            />
          </div>
        </div>

        <hr className="my-0" />
        <div className="modal-content-recipes">
          <div className="row">
            <table className="table table-mt">
              <thead>
                <tr>
                  <th scope="col" className="text-recipe text-center">
                    Product
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>CU</b>
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>SKU</b>
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>PALLET</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center"></td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('product_cu')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('product_cu')
                          ? null
                          : setLabelValue(1);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('product_sku')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('product_sku')
                          ? null
                          : setLabelValue(2);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('product_pallet')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('product_pallet')
                          ? null
                          : setLabelValue(3);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                </tr>
                {productLabelTypes.length > 0 ? (
                  <tr>
                    <td className="text-center"></td>
                    <td className="text-center">
                      {productLabelTypes.includes('product_cu') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) => label.label_type === 'product_cu',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) => label.label_type === 'product_cu',
                              )?.file
                                ? 'cu_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>
                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('product_cu')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                    <td className="text-center">
                      {productLabelTypes.includes('product_sku') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) => label.label_type === 'product_sku',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) => label.label_type === 'product_sku',
                              )?.file
                                ? 'sku_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>

                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('product_sku')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                    <td className="text-center">
                      {productLabelTypes.includes('product_pallet') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) =>
                                  label.label_type === 'product_pallet',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) =>
                                  label.label_type === 'product_pallet',
                              )?.file
                                ? 'pallet_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>
                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('product_pallet')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <th scope="col" className="text-recipe text-center">
                    Barcode
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>CU</b>
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>SKU</b>
                  </th>
                  <th scope="col" className="text-recipe text-center">
                    <b>PALLET</b>
                  </th>
                </tr>
                <tr>
                  <td className="text-center"></td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('barcode_cu')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('barcode_cu')
                          ? null
                          : setLabelValue(4);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('barcode_sku')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('barcode_sku')
                          ? null
                          : setLabelValue(5);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                  <td className="text-center">
                    <img
                      src={
                        selectedLabels
                          .map((label) => label.label_type)
                          .includes('barcode_pallet')
                          ? pdf_full
                          : pdf_blurred
                      }
                      className="cursor-event"
                      onClick={() => {
                        productLabelTypes.includes('barcode_pallet')
                          ? null
                          : setLabelValue(6);
                      }}
                      alt=""
                      height={100}
                      width={100}
                    />
                  </td>
                </tr>
                {barcodeLabelTypes.length > 0 ? (
                  <tr>
                    <td></td>
                    <td className="text-center">
                      {barcodeLabelTypes.includes('barcode_cu') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) => label.label_type === 'barcode_cu',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) => label.label_type === 'barcode_cu',
                              )?.file
                                ? 'cu_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>
                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('barcode_cu')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                    <td className="text-center">
                      {barcodeLabelTypes.includes('barcode_sku') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) => label.label_type === 'barcode_sku',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) => label.label_type === 'barcode_sku',
                              )?.file
                                ? 'sku_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>

                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('barcode_sku')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                    <td className="text-center">
                      {barcodeLabelTypes.includes('barcode_pallet') ? (
                        <>
                          <a
                            href={
                              selectedLabels?.find(
                                (label) =>
                                  label.label_type === 'barcode_pallet',
                              )?.file ?? '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              selectedLabels?.find(
                                (label) =>
                                  label.label_type === 'barcode_pallet',
                              )?.file
                                ? 'pallet_label'
                                : false
                            }
                          >
                            <img
                              src={download_label}
                              className="cursor-event me-5"
                              alt=""
                            />
                          </a>
                          <img
                            src={delete_label}
                            className="cursor-event"
                            onClick={() => handleDelete('barcode_pallet')}
                            alt=""
                          />
                        </>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <th scope="col" className="text-recipe text-center">
                    Product Image
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <td scope="col"></td>

                  <td
                    scope="col"
                    className="text-recipe text-center"
                    onClick={() => {
                      setUploadImage(1);
                    }}
                  >
                    <button className="border-0 rounded p-2">
                      <img
                        src={upload}
                        className="pt-2"
                        alt="Upload Image"
                        width={30}
                        height={30}
                      />
                      <div className="pb-2">Upload Image</div>
                    </button>
                  </td>
                  <td colSpan={2}>
                    {selectedImage && (
                      <img
                        src={selectedImage ? selectedImage : null}
                        className="cursor-event"
                        alt=""
                        height={100}
                        width={200}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {uploadImage ? (
            <form onSubmit={handleSubmit(handleImageLabel)}>
              <div className="modal-overlay-recipes">
                <div
                  className="modal-body-recipes modal-body-recipes-label"
                  style={{ minHeight: 'auto' }}
                >
                  <div className="d-flex flex-column modal-header-recipes list-header">
                    <p className="align-self-start fw-bold fs-6">Add Image</p>

                    <img
                      onClick={() => {
                        closeImageModal();
                      }}
                      className="align-self-end page-close"
                      src={close}
                      alt=""
                    />
                  </div>
                  <hr className="my-0" />
                  <div className="modal-content-recipes">
                    <div className="row p-2">
                      <div className="mt-2 col-md-12">
                        <label
                          htmlFor="file"
                          className="form-label fw-bold text-warning"
                        >
                          Image File
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          {...register('file', {
                            required: 'file is required',
                          })}
                          onChange={(e) => uploadImageFile(e)}
                          id="file"
                          placeholder="Upload File"
                        />
                        {errors.file && (
                          <p className="text-danger">{errors?.file?.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-content-center p-4">
                      <button
                        type="submit"
                        className="btn btn-orange float-center create-create-btn"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : null}
          {labelValue ? (
            <form onSubmit={handleSubmit(handleAddLabel)}>
              <div className="modal-overlay-recipes">
                <div
                  className="modal-body-recipes modal-body-recipes-label"
                  style={{ minHeight: 'auto' }}
                >
                  <div className="d-flex flex-column modal-header-recipes list-header">
                    <p className="align-self-start fw-bold fs-6">Add Label</p>

                    <img
                      onClick={() => {
                        closeLabel();
                      }}
                      className="align-self-end page-close"
                      src={close}
                      alt=""
                    />
                  </div>
                  <hr className="my-0" />
                  <div className="modal-content-recipes">
                    <div className="row p-2">
                      <div className="col-md-12">
                        <label
                          htmlFor="label"
                          className="form-label fw-bold text-warning"
                        >
                          Label Type
                        </label>
                        <DropDown
                          isClear={false}
                          dropDownValue={labels}
                          defaultValue={labels.find((l) => l.id === labelValue)}
                          placeholderUpdated="Select Label"
                        />
                      </div>
                      <div className="col-md-12 py-2">
                        <label
                          htmlFor="ean_number"
                          className="form-label fw-bold text-warning"
                        >
                          EAN Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register('ean_number', {
                            required: 'EAN Number is required',
                          })}
                          id="ean_number"
                          placeholder="EAN Number"
                        />
                        {errors.ean_number && (
                          <p className="text-danger">
                            {errors.ean_number.message}
                          </p>
                        )}
                      </div>
                      <div className="col-md-12">
                        <label
                          htmlFor="file"
                          className="form-label fw-bold text-warning"
                        >
                          PDF File
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          {...register('file', {
                            required: 'file is required',
                          })}
                          onChange={(e) => uploadFile(e)}
                          // ref={ref}
                          id="file"
                          placeholder="Upload File"
                        />
                        {errors.file && (
                          <p className="text-danger">{errors?.file?.message}</p>
                        )}
                      </div>
                      {base64File && (
                        <div className="mt-3">
                          <img
                            src={pdf}
                            className="cursor-event"
                            onClick={() => {
                              setLabelValue(true);
                            }}
                            alt=""
                          />
                          <img
                            src={close_label}
                            className="align-top cursor-event"
                            onClick={() => {
                              setBase64File('');
                              resetField('file');
                              setError('file', {
                                type: 'manual',
                                message: 'File is required',
                              });
                            }}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-center p-4">
                      <button
                        type="submit"
                        className="btn btn-orange float-center create-create-btn"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Label;

Label.propTypes = {
  batchTemplateID: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
