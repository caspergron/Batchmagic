import React from 'react';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PermissionGuard = ({ permission, children }) => {
    const { hasPermission } = useAuth();

    if (!hasPermission(permission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

PermissionGuard.propTypes = {
    permission: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default PermissionGuard;