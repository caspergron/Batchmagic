import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../../../../components/Loader';
import { isEmpty } from '../../../../../components/utils';
import CloseIcon from '@mui/icons-material/Close';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';

const Show = () => {
    const [user, setUser] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();

    useEffect(() => {
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(`/user/${params.id}`, {
                    signal: controller.signal,
                });
                setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
        return () => controller.abort();
    }, [params.id]);

    return (
        <div>
            {isEmpty(user) ? (
                <Loader />
            ) : (
                <div>
                    <Link to="/dashboard/user-management" className="d-flex flex-column">
                        <CloseIcon
                            className="align-self-end page-close show-page-close-position"
                            style={{ fontSize: 28, cursor: 'pointer' }}
                        />
                    </Link>
                    <Link to={`/dashboard/user-management/edit/${user.id}`}>
                        <button
                            type="button"
                            className="align-self-end show-update-btn show-update-btn-position"
                        >
                            Update Info
                        </button>
                    </Link>

                    <div>
                        <h1 className="align-self-start show-header mt-84">
                            User Information
                        </h1>
                        <div className="d-flex flex-column show-table-body">
                            <table className="table table-striped table-bordered show-table-first">
                                <tbody>
                                    <tr>
                                        <th scope="col">First Name</th>
                                        <td>{user?.first_name}</td>
                                        <th scope="col">Last Name</th>
                                        <td>{user?.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th scope="col">Role</th>
                                        <td>{user?.role}</td>
                                        <th scope="col">Gender</th>
                                        <td>{user?.gender}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Show;