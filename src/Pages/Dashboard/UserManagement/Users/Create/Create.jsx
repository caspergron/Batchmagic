import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import useAxiosPrivate from '../../../../../hooks/useAxiosPrivate';
import useAuth from '../../../../../hooks/useAuth';

const Create = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
    } = useForm();

    const [roles, setRoles] = useState([]);
    const [serverError, setServerError] = useState(null);
    const { userInfo } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const password = watch('password');

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

    const onSubmit = async (data) => {
        try {
            setServerError(null);
            const formData = {
                ...data,
                org_id: userInfo.org_id,
                role: roles.find(role => role.id == data.role_id)?.name,
            };
            await axiosPrivate.post('/registration', formData);
            navigate('/dashboard/user-management');
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                // Handle validation errors from the server
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach(field => {
                    setError(field, {
                        type: 'server',
                        message: serverErrors[field][0]
                    });
                });
            } else {
                setServerError('Failed to create user. Please try again later.');
            }
        }
    };

    return (
        <div>
            <Link to="/dashboard/user-management" className="d-flex flex-column">
                <CloseIcon
                    className="align-self-end page-close create-page-close-position"
                    style={{ fontSize: 28, cursor: 'pointer' }}
                />
            </Link>
            <h1 className="text-center create-header create-header-my">
                Create New User
            </h1>
            {serverError && (
                <div className="alert alert-danger text-center" role="alert">
                    {serverError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row p-5 create-data-container create-data-info">
                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="first_name" className="form-label fw-bold text-warning">
                            First Name
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                            id="first_name"
                            {...register('first_name', { required: 'First name is required' })}
                        />
                        {errors.first_name && (
                            <p className="text-danger">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="last_name" className="form-label fw-bold text-warning">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                            id="last_name"
                            {...register('last_name', { required: 'Last name is required' })}
                        />
                        {errors.last_name && (
                            <p className="text-danger">{errors.last_name.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="email" className="form-label fw-bold text-warning">
                            Email
                        </label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-danger">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="phone" className="form-label fw-bold text-warning">
                            Phone
                        </label>
                        <input
                            type="text"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^\+?[1-9]\d{1,14}$/,
                                    message: "Invalid phone number format"
                                }
                            })}
                        />
                        {errors.phone && (
                            <p className="text-danger">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="age" className="form-label fw-bold text-warning">
                            Age
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                            id="age"
                            {...register('age', {
                                required: 'Age is required',
                                min: {
                                    value: 18,
                                    message: 'Age must be at least 18'
                                },
                                max: {
                                    value: 100,
                                    message: 'Age must be less than 100'
                                }
                            })}
                        />
                        {errors.age && (
                            <p className="text-danger">{errors.age.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="role" className="form-label fw-bold text-warning">
                            Role
                        </label>
                        <select
                            className={`form-control ${errors.role_id ? 'is-invalid' : ''}`}
                            id="role"
                            {...register('role_id', { required: 'Role is required' })}
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && (
                            <p className="text-danger">{errors.role_id.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="gender" className="form-label fw-bold text-warning">
                            Gender
                        </label>
                        <select
                            className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                            id="gender"
                            {...register('gender', { required: 'Gender is required' })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-danger">{errors.gender.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="password" className="form-label fw-bold text-warning">
                            Password
                        </label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-danger">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="col-md-6 py-3 px-80">
                        <label htmlFor="password_confirmation" className="form-label fw-bold text-warning">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                            id="password_confirmation"
                            {...register('password_confirmation', {
                                required: 'Please confirm password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                        />
                        {errors.password_confirmation && (
                            <p className="text-danger">{errors.password_confirmation.message}</p>
                        )}
                    </div>

                    <div className="col-md-12 p-3">
                        <button
                            type="submit"
                            className="btn btn-orange float-end create-create-btn"
                        >
                            Create User
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Create;