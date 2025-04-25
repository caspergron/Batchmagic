import React, { useEffect, useState, useMemo } from 'react';
import edit from '../../../../assets/Logo/actions/edit.svg';
import ErrorModal from '../../../../components/ErrorModal';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import '@/assets/style/CommonCSS/Modal.css';
import DataTables from '../../../../components/DataTablesNew';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { register, handleSubmit, reset, setValue } = useForm();

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row) => row.description || 'N/A',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="action-container">
                    <button
                        className="btn btn-action-customized"
                        onClick={() => handleEdit(row)}
                    >
                        <img src={edit} className="edit-action" alt="" />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axiosPrivate.get('/roles');
            setRoles(response.data);
        } catch (error) {
            <ErrorModal />;
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axiosPrivate.get('/permissions');
            setPermissions(response.data.data);
        } catch (error) {
            <ErrorModal />;
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setValue('name', role.name);
        setValue('description', role.description);

        // Handle assigned permissions
        if (role.assigned_permissions && Array.isArray(role.assigned_permissions)) {
            const permissionIds = role.assigned_permissions.map(p => p.id.toString());

            // Set each permission checkbox
            permissions.forEach(permission => {
                const fieldName = `permissions.${permission.id}`;
                setValue(fieldName, permissionIds.includes(permission.id.toString()));
            });
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
            reset();
            setEditingRole(null);
        }, 300);
    };

    const onSubmit = async (data) => {
        try {
            // Convert checked permissions to array of IDs
            const selectedPermissions = Object.entries(data.permissions || {})
                .filter(([_, isChecked]) => isChecked)
                .map(([id]) => parseInt(id));

            const formData = {
                name: data.name,
                description: data.description,
                permissions: selectedPermissions
            };

            if (editingRole) {
                await axiosPrivate.put(`/role/${editingRole.id}`, formData);
            } else {
                await axiosPrivate.post('/role', formData);
            }
            fetchRoles();
            handleCloseModal();
        } catch (error) {
            <ErrorModal />;
        }
    };

    const memoizedData = useMemo(() => roles.data, [roles]);

    return (
        <div>
            <h1 className="text-center my-64 list-header">Roles</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    className="btn list-add-btn"
                    onClick={() => {
                        setEditingRole(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                >
                    Add Role
                </button>
            </div>
            <DataTables
                columns={columns}
                data={memoizedData}
                searchPlaceholder="Search Roles"
                searchBar={true}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className={`modal-overlay-recipes ${isClosing ? 'overlay-exit' : ''}`}>
                    <div className={`modal-body-recipes ${isClosing ? 'modal-exit' : ''}`}>
                        <div className="d-flex justify-content-between modal-header-recipes">
                            <h4 className="m-0">{editingRole ? 'Edit Role' : 'Create Role'}</h4>
                            <button className="modal-close-btn" onClick={handleCloseModal}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="modal-content-recipes">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-form-group">
                                    <label>Name</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        className="modal-form-control"
                                        placeholder="Enter role name"
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>Description</label>
                                    <textarea
                                        {...register('description')}
                                        className="modal-form-control"
                                        placeholder="Enter role description"
                                        rows={3}
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>Permissions</label>
                                    <div className="permissions-grid">
                                        {permissions.map(permission => (
                                            <div key={permission.id} className="permission-item">
                                                <label className="d-flex align-items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        {...register(`permissions.${permission.id}`)}
                                                        className="form-check-input"
                                                    />
                                                    <span>{permission.name}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-end mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-orange">
                                        {editingRole ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleList;