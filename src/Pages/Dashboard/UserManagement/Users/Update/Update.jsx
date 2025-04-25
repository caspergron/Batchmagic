import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../../../../components/Loader';
import { isEmpty } from '../../../../../components/utils';
import CloseIcon from '@mui/icons-material/Close';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';

const Update = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    const [serverError, setServerError] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const controller = new AbortController();
        const getRoles = async () => {
            try {
                const response = await axiosPrivate.get('/roles', {
                    signal: controller.signal,
                });
                setRoles(response.data.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setServerError('Failed to load roles. Please try again later.');
            }
        };
        getRoles();
        return () => controller.abort();
    }, []);

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

    useEffect(() => {
        if (user) {
            setValue('first_name', user.first_name);
            setValue('last_name', user.last_name);
            setValue('role', user.role);
            setValue('role_id', user?.userRole?.id);
            setValue('gender', user.gender);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            data.role = roles.find(role => role.id == data.role_id)?.name;
            await axiosPrivate.put(`/user/${params.id}`, data);
            navigate('/dashboard/user-management');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            {isEmpty(user) ? (
                <Loader />
            ) : (
                <div>
                    <Link to="/dashboard/user-management" className="d-flex flex-column">
                        <CloseIcon
                            className="align-self-end page-close edit-page-close-position"
                            style={{ fontSize: 28, cursor: 'pointer' }}
                        />
                    </Link>
                    <h1 className="text-center edit-header edit-header-my">
                        Update User Information
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row p-5 edit-data-container edit-data-info">
                            <div className="col-md-6 py-3 px-80">
                                <label
                                    htmlFor="first_name"
                                    className="form-label fw-bold text-warning"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    {...register('first_name', { required: 'First name is required' })}
                                />
                                {errors.first_name && (
                                    <p className="text-danger">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div className="col-md-6 py-3 px-80">
                                <label
                                    htmlFor="last_name"
                                    className="form-label fw-bold text-warning"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    {...register('last_name', { required: 'Last name is required' })}
                                />
                                {errors.last_name && (
                                    <p className="text-danger">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div className="col-md-6 py-3 px-80">
                                <label
                                    htmlFor="role"
                                    className="form-label fw-bold text-warning"
                                >
                                    Role
                                </label>
                                <select
                                    className="form-control"
                                    id="role_id"
                                    {...register('role_id', { required: 'Role is required' })}
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-danger">{errors.role.message}</p>
                                )}
                            </div>

                            <div className="col-md-6 py-3 px-80">
                                <label
                                    htmlFor="gender"
                                    className="form-label fw-bold text-warning"
                                >
                                    Gender
                                </label>
                                <select
                                    className="form-control"
                                    id="gender"
                                    {...register('gender', { required: 'Gender is required' })}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-danger">{errors.gender.message}</p>
                                )}
                            </div>

                            <div className="col-md-12 p-3">
                                <button
                                    type="submit"
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

export default Update;