import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface RoleGuardProps {
    allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user } = useAppContext();
    const userRole = (user?.role || '').toUpperCase();

    const hasAccess = allowedRoles.includes(userRole);

    if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
