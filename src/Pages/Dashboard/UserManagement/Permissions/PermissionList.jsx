import React, { useEffect, useState, useMemo } from 'react';
import edit from '../../../../assets/Logo/actions/edit.svg';
import ErrorModal from '../../../../components/ErrorModal';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import '@/assets/style/CommonCSS/Modal.css';
import DataTables from '../../../../components/DataTablesNew';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
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
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await axiosPrivate.get('/permissions');
            setPermissions(response.data);
        } catch (error) {
            <ErrorModal />;
        }
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        setValue('name', permission.name);
        setValue('description', permission.description);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
            reset();
            setEditingPermission(null);
        }, 300);
    };

    const onSubmit = async (data) => {
        try {
            if (editingPermission) {
                await axiosPrivate.put(`/permission/${editingPermission.id}`, data);
            } else {
                await axiosPrivate.post('/permission', data);
            }
            fetchPermissions();
            handleCloseModal();
        } catch (error) {
            <ErrorModal />;
        }
    };

    const memoizedData = useMemo(() => permissions.data, [permissions]);

    return (
        <div>
            <h1 className="text-center my-64 list-header">Permissions</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                    className="btn list-add-btn"
                    onClick={() => {
                        setEditingPermission(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                >
                    Add Permission
                </button>
            </div>
            <DataTables
                columns={columns}
                data={memoizedData}
                searchPlaceholder="Search Permissions"
                searchBar={true}
            />

            {/* Modal */}
            {isModalOpen && (
                <div className={`modal-overlay-recipes ${isClosing ? 'overlay-exit' : ''}`}>
                    <div className={`modal-body-recipes ${isClosing ? 'modal-exit' : ''}`}>
                        <div className="d-flex justify-content-between modal-header-recipes">
                            <h4 className="m-0">{editingPermission ? 'Edit Permission' : 'Create Permission'}</h4>
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
                                        placeholder="Enter permission name"
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>Description</label>
                                    <textarea
                                        {...register('description')}
                                        className="modal-form-control"
                                        placeholder="Enter permission description"
                                        rows={3}
                                    />
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
                                        {editingPermission ? 'Update' : 'Create'}
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

export default PermissionList;