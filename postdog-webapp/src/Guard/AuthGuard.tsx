import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface AuthGuardProps {
    isPublic?: boolean;
}


const AuthGuard: React.FC<AuthGuardProps> = ({ isPublic = false }) => {
    const { user } = useAppContext();
    const isAuthenticated = !!user?.access_token;

    if (isPublic) {
        return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
