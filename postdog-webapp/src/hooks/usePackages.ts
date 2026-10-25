import { useState, useEffect, useCallback, useRef } from 'react';
import PackageService from '../services/PackageService';
import { PackageResponse } from '../types';
import { useNotification } from '../context/NotificationContext';

export const usePackages = () => {
    const [packages, setPackages] = useState<PackageResponse[]>([]);
    const { showNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchPackages = useCallback(async (page: number, append: boolean = false, search: string = '') => {
        if (page === 1) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const response = await PackageService.getPackages(page, 10, search);
            
            const sortedData = [...response.data].sort((a, b) => {
                if (a.isFavorite === b.isFavorite) return 0;
                return a.isFavorite ? -1 : 1;
            });

            if (append) {
                setPackages(prev => [...prev, ...sortedData]);
            } else {
                setPackages(sortedData);
            }

            setTotalPages(response.meta.totalPages);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los paquetes');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages(1, false, searchTerm);
    }, [fetchPackages, searchTerm]);

    const loadMore = useCallback(() => {
        if (!loading && !isFetchingMore && currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPackages(nextPage, true, searchTerm);
        }
    }, [loading, isFetchingMore, currentPage, totalPages, fetchPackages, searchTerm]);

    useEffect(() => {
        const currentTarget = observerTarget.current;
        if (!currentTarget) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && currentPage < totalPages && !isFetchingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(currentTarget);
        return () => observer.unobserve(currentTarget);
    }, [currentPage, totalPages, isFetchingMore, loadMore]);

    const handleDelete = async (uid: string) => {
        try {
            await PackageService.deletePackage(uid);
            setPackages(prev => prev.filter(p => p.uid !== uid));
            showNotification("Proceso Exitoso", "Paquete eliminado exitosamente.", 'success', 5000);
        } catch (err: any) {
            setError(err.message || 'Error al eliminar');
        }
    };

    const handleToggleFavorite = async (uid: string) => {
        try {
            const updatedPkg = await PackageService.toggleFavorite(uid);

            setPackages(prev => {
                const newList = prev.map(p => {
                    if (p.uid === uid) {
                        return { ...p, isFavorite: updatedPkg.isFavorite };
                    }
                    if (updatedPkg.isFavorite && p.isFavorite) {
                        return { ...p, isFavorite: false };
                    }
                    return p;
                });

                return [...newList].sort((a, b) => {
                    if (a.isFavorite === b.isFavorite) return 0;
                    return a.isFavorite ? -1 : 1;
                });
            });

            const message = updatedPkg.isFavorite
                ? 'Paquete agregado a favoritos'
                : 'Paquete quitado de favoritos';
            showNotification("Proceso Exitoso", message, 'success', 2000);

        } catch (err: any) {
            showNotification("Error", "No se pudo actualizar el favorito", 'error', 5000);
        }
    };

    return {
        packages,
        loading,
        isFetchingMore,
        error,
        observerTarget,
        searchTerm,
        setSearchTerm,
        hasMore: currentPage < totalPages,
        refreshPackages: (pkg?: PackageResponse) => {
            if (pkg) {
                setPackages(prev => {
                    const others = prev.filter(p => p.uid !== pkg.uid);
                    
                    const favorites = others.filter(p => p.isFavorite);
                    const nonFavorites = others.filter(p => !p.isFavorite);

                    if (pkg.isFavorite) {
                        return [pkg, ...nonFavorites];
                    } else {
                        return [...favorites, pkg, ...nonFavorites];
                    }
                });
            } else {
                setCurrentPage(1);
                fetchPackages(1, false, searchTerm);
            }
        },
        handleDelete,
        handleToggleFavorite
    };
};