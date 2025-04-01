import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import DataTables from '../../../../components/DataTablesNew';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import show from '../../../../assets/Logo/actions/show.svg';
import edit from '../../../../assets/Logo/actions/edit.svg';
// import deletes from '../../../../assets/Logo/delete.png';
import { Link } from 'react-router-dom';
import ErrorModal from '../../../../components/ErrorModal';

const columns = [
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Products',
    selector: (row) => row?.product?.length,
    sortable: true,
  },
  {
    name: 'Actions',
    cell: (row) => (
      <div className="action-container">
        <Link to={`/dashboard/supplier/show/${row.id}`}>
          <button className="btn btn-action-customized">
            <img src={show} className="show-action" alt="" />
          </button>
        </Link>
        <Link to={`/dashboard/supplier/edit/${row.id}`}>
          <button className="btn btn-action-customized">
            <img src={edit} className="edit-action" alt="" />
          </button>
        </Link>
        {/* <button className="btn btn-danger"><img src={deletes} className="edit-image" alt="" /></button> */}
      </div>
    ),
  },
];

const Index = () => {
  const [suppliers, setSuppliers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSuppliers = async () => {
      try {
        // setLoading(true)
        const response = await axiosPrivate.get('/suppliers', {
          signal: controller.signal,
        });
        // setLoading(false)
        if (isMounted) {
          setSuppliers(response?.data);
        }
      } catch (error) {
        // setLoading(false)
        if (error instanceof DOMException && error.name == 'AbortError') {
          <ErrorModal />;
        } else {
          <ErrorModal />;
        }
      }
    };
    getSuppliers();
    return () => {
      // setLoading(false)
      isMounted = false;
      controller.abort();
    };
  }, []);

  const memoizedData = useMemo(() => suppliers.data, [suppliers]);
  return (
    <div>
      {/* {
          loading &&
                <div className='d-flex justify-content-center align-items-center'>
                    <Loader />
                </div>
            } */}
      <h1 className="text-center my-64 list-header">Suppliers</h1>
      <DataTables
        columns={columns}
        data={memoizedData}
        header={'Supplier'}
        navigation={'/dashboard/supplier/create'}
        searchPlaceholder="Search Suppliers"
      />
    </div>
  );
};

export default Index;
