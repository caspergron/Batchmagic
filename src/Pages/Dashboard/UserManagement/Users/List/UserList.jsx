import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';

import show from '../../../../../assets/Logo/actions/show.svg';
import edit from '../../../../../assets/Logo/actions/edit.svg';
import { Link } from 'react-router-dom';

import DataTables from '../../../../../components/DataTablesNew';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import ErrorModal from '../../../../../components/ErrorModal';

const columns = [
    {
        name: 'First Name',
        selector: (row) => row.first_name,
        sortable: true,
    },
    {
        name: 'Last Name',
        selector: (row) => row.last_name,
        sortable: true,
    },
    {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
    },
    {
        name: 'Role',
        selector: (row) => row.role,
        sortable: true,
    },
    {
        name: 'Gender',
        selector: (row) => row.gender,
        sortable: true,
    },
    {
        name: 'Actions',
        cell: (row) => (
            <div className="action-container">
                <Link to={`/dashboard/user-management/show/${row.id}`}>
                    <button className="btn btn-action-customized">
                        <img src={show} className="show-action" alt="" />
                    </button>
                </Link>
                <Link to={`/dashboard/user-management/edit/${row.id}`}>
                    <button className="btn btn-action-customized">
                        <img src={edit} className="edit-action" alt="" />
                    </button>
                </Link>
            </div>
        ),
    },
];

const UserList = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal,
                });
                if (isMounted) {
                    setUsers(response?.data);
                }
            } catch (error) {
                if (error instanceof DOMException && error.name == 'AbortError') {
                    <ErrorModal />;
                } else {
                    <ErrorModal />;
                }
            }
        };
        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const memoizedData = useMemo(() => users.data, [users]);

    return (
        <div>
            <h1 className="text-center my-64 list-header">Users</h1>
            <DataTables
                columns={columns}
                data={memoizedData}
                header={'User'}
                navigation={'/dashboard/user-management/create'}
                searchPlaceholder="Search Users"
            />
        </div>
    );
};

export default UserList;