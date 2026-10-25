import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { useAppContext } from './AppContext';
import { NotificationItem, RealTimeNotificationContextType } from '../types';



const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | undefined>(undefined);

export const RealTimeNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
        if (!user) return;
        
        if (page === 1 && !append) {
            setLoading(true);
            setNotifications([]);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const [notificationsRes, count] = await Promise.all([
                notificationService.getNotifications(page, 10, search, filterType, true),
                notificationService.getUnreadCount()
            ]);

            if (notificationsRes && notificationsRes.items) {
                if (append) {
                    setNotifications(prev => [...prev, ...notificationsRes.items]);
                } else {
                    setNotifications(notificationsRes.items);
                }
                setTotalPages(notificationsRes.meta.totalPages || 1);
                setCurrentPage(notificationsRes.meta.currentPage || 1);
            }
            setUnreadCount(count);
        } catch (error) {
            console.error('Error in fetchNotifications context:', error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [user, search, filterType]);

    const fetchNotificationsRef = React.useRef(fetchNotifications);

    useEffect(() => {
        fetchNotificationsRef.current = fetchNotifications;
    }, [fetchNotifications]);

    const loadMore = useCallback(() => {
        if (!loading && !isFetchingMore && currentPage < totalPages) {
            const nextPage = currentPage + 1;
            fetchNotifications(nextPage, true);
        }
    }, [loading, isFetchingMore, currentPage, totalPages, fetchNotifications]);

    const markAsRead = async (uid: string) => {
        await notificationService.markAsRead(uid);
        setNotifications(prev => 
            prev.map(n => n.uid === uid ? { ...n, readAt: new Date().toISOString() } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
        setUnreadCount(0);
    };

    useEffect(() => {
        if (!user) return;
        
        setCurrentPage(1);
        setTotalPages(1);
        
        fetchNotifications(1, false);
    }, [user, search, filterType, fetchNotifications]);

    useEffect(() => {
        if (!user) return;
        
        const unsubscribe = notificationService.onMessageListener((payload) => {
            // console.log('FCM: Notificación recibida en primer plano (Foreground):', payload
            setTimeout(() => {
                if (fetchNotificationsRef.current) {
                    // console.log('FCM: Actualizando lista de notificaciones (Foreground)...');
                    fetchNotificationsRef.current(1, false);
                }
            }, 1000);
        });

        const handleServiceWorkerMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'FCM_BACKGROUND_MESSAGE') {
                // console.log('FCM: Notificación recibida desde el Service Worker (Background):', event.data.payload);
                if (fetchNotificationsRef.current) {
                    // console.log('FCM: Actualizando lista de notificaciones (Background)...');
                    fetchNotificationsRef.current(1, false);
                }
            }
        };
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // console.log('FCM: Pestaña visible. Sincronizando notificaciones...');
                if (fetchNotificationsRef.current) {
                    fetchNotificationsRef.current(1, false);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            unsubscribe();
            navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);

    return (
        <RealTimeNotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            isFetchingMore,
            hasMore: currentPage < totalPages,
            search,
            filterType,
            setSearch,
            setFilterType,
            fetchNotifications,
            loadMore,
            markAsRead,
            markAllAsRead,
        }}>
            {children}
        </RealTimeNotificationContext.Provider>
    );
};

export const useRealTimeNotificationsContext = () => {
    const context = useContext(RealTimeNotificationContext);
    if (!context) {
        throw new Error('useRealTimeNotifications must be used within a RealTimeNotificationProvider');
    }
    return context;
};
