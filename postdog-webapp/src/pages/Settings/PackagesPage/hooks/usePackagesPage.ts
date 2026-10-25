import { useState, useCallback } from 'react';
import { usePackages } from '../../../../hooks/usePackages';
import { PackageResponse } from '../../../../types';

export const usePackagesPage = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageResponse | null>(null);

    const {
        packages,
        loading,
        isFetchingMore,
        error,
        observerTarget,
        searchTerm,
        setSearchTerm,
        handleDelete,
        handleToggleFavorite,
        refreshPackages
    } = usePackages();

    const handleOpenAddModal = useCallback(() => {
        setSelectedPackage(null);
        setIsDrawerOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((pkg: PackageResponse) => {
        setSelectedPackage(pkg);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback((shouldRefresh: boolean, pkg?: PackageResponse) => {
        setIsDrawerOpen(false);
        setSelectedPackage(null);
        if (shouldRefresh === true) { 
            refreshPackages(pkg);
        }
    }, [refreshPackages]);

    const handleSearch = useCallback((v: string) => {
        setSearchTerm(v); 
    }, [setSearchTerm]);

    return {
        packages,
        loading,
        isFetchingMore,
        error,
        observerTarget,

        isDrawerOpen,
        selectedPackage,
        
        handleOpenAddModal,
        handleOpenEditModal,
        handleCloseDrawer,
        handleSearch,
        
        handleDelete,
        handleToggleFavorite,
        searchTerm,
        setSearchTerm,
        refreshPackages
    };
};