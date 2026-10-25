import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { GlobalAlertsService } from '../services/GlobalAlertsService';
import { Alert, GlobalAlertCreateRequest } from '../types/globalAlerts.type';

export const useGlobalAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    const fetchAlerts = useCallback(async (isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true);
            setPage(1);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const currentPage = isLoadMore ? page + 1 : 1;
            const response = await GlobalAlertsService.getAll(currentPage, 10);
            
            const fetchedItems = response.items || [];
            
            if (isLoadMore) {
                setAlerts(prev => [...prev, ...fetchedItems]);
            } else {
                setAlerts(fetchedItems);
            }
            
            setHasMore(currentPage < (response.meta?.totalPages || 1));
            setPage(currentPage);
            setError(null);
        } catch (err) {
            setError('Error al cargar las alertas');
            console.error(err);
        } finally {
            if (!isLoadMore) {
                setLoading(false);
            } else {
                setIsFetchingMore(false);
            }
        }
    }, [page]);

    const createAlert = async (data: GlobalAlertCreateRequest) => {
        setLoading(true);
        try {
            await GlobalAlertsService.create(data);
            await fetchAlerts(false);
        } catch (err) {
            setError('Error al crear la alerta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateAlert = async (uid: string, data: GlobalAlertCreateRequest) => {
        setLoading(true);
        try {
            await GlobalAlertsService.update(uid, data);
            await fetchAlerts(false);
        } catch (err) {
            setError('Error al actualizar la alerta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (uid: string) => {
        setLoading(true);
        try {
            await GlobalAlertsService.delete(uid);
            await fetchAlerts(false);
        } catch (err) {
            setError('Error al eliminar la alerta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const togglePin = async (uid: string, isPinned: boolean) => {
        try {
            const alertToToggle = alerts.find(a => a.uid === uid);
            if (!alertToToggle) return;

            if (isPinned) {
                const currentlyPinned = alerts.filter(a => a.isPinned);
                if (currentlyPinned.length >= 3) {
                    const oldest = currentlyPinned.sort((a, b) => 
                        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    )[0];
                    
                    if (oldest) {
                        await GlobalAlertsService.update(oldest.uid, {
                            title: oldest.title,
                            message: oldest.message,
                            icon: oldest.icon,
                            sendAt: oldest.sendAt,
                            priority: oldest.priority.toUpperCase() as any,
                            isPinned: false
                        });
                    }
                }
            }

            await GlobalAlertsService.update(uid, {
                title: alertToToggle.title,
                message: alertToToggle.message,
                icon: alertToToggle.icon,
                sendAt: alertToToggle.sendAt,
                priority: alertToToggle.priority.toUpperCase() as any,
                isPinned: isPinned
            });
            await fetchAlerts(false);
        } catch (err) {
            setError('Error al cambiar el estado fijado');
            console.error(err);
            throw err;
        }
    };

    useEffect(() => {
        fetchAlerts(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading) {
                    fetchAlerts(true);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isFetchingMore, loading, fetchAlerts]);

    return {
        alerts,
        loading,
        error,
        hasMore,
        isFetchingMore,
        observerTarget: observerTarget as RefObject<HTMLDivElement>,
        createAlert,
        updateAlert,
        deleteAlert,
        togglePin,
        refresh: () => fetchAlerts(false)
    };
};
