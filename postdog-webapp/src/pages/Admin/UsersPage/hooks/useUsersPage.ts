import { useState, useEffect, useCallback } from 'react';
import { AdminUserService } from '../../../../services/AdminUserService';
import { useNotification } from '../../../../context/NotificationContext';
import { useAppContext } from '../../../../context/AppContext';
import { UserStats } from '../../../../types';
import { mapAdminUserToUI } from '../../../../utils/mappers/user.mapper';

export const useUsersPage = () => {
    const { user: currentUser } = useAppContext();
    const { showNotification } = useNotification();
    
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [loadingStats, setLoadingStats] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalItems, setTotalItems] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        verification: 'all',
        plan: 'all',
        role: 'all',
        status: 'all',
        dateType: 'all',
        startDate: null as string | null,
        endDate: null as string | null,
        sortBy: 'created_at',
        sortOrder: 'DESC' as 'ASC' | 'DESC'
    });

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [bulkValue, setBulkValue] = useState<string>('');

    const isVendor = currentUser?.role?.toUpperCase() === 'VENDOR';

    const fetchUsers = useCallback(async (pageNum = 1, shouldAppend = false) => {
        if (pageNum === 1 && !shouldAppend) setLoading(true);
        else setIsFetchingMore(true);

        try {
            const response = await AdminUserService.getAll(pageNum, 50, { 
                search: searchTerm, 
                ...filters 
            });
            
            if (shouldAppend) {
                setUsers(prev => [...prev, ...response.items]);
            } else {
                setUsers(response.items);
                setPage(1);
            }

            setTotalItems(response.meta.totalItems);
            setHasMore(response.meta.currentPage < response.meta.totalPages);
            setPage(response.meta.currentPage);
        } catch (error) {
            showNotification('Error', 'No se pudieron cargar los usuarios', 'error');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [searchTerm, filters, showNotification]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1, false);
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    useEffect(() => {
        setLoadingStats(true);
        AdminUserService.getStats()
            .then(setStats)
            .finally(() => setLoadingStats(false));
    }, []);

    const handleLoadMore = () => {
        if (!loading && !isFetchingMore && hasMore) {
            fetchUsers(page + 1, true);
        }
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (field: string) => {
        setFilters(prev => {
            const isSameField = prev.sortBy === field;
            const newOrder = isSameField && prev.sortOrder === 'DESC' ? 'ASC' : 'DESC';
            return {
                ...prev,
                sortBy: field,
                sortOrder: newOrder
            };
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            verification: 'all',
            plan: 'all',
            role: 'all',
            status: 'all',
            dateType: 'all',
            startDate: null,
            endDate: null,
            sortBy: 'created_at',
            sortOrder: 'DESC'
        });
    };

    const toggleUserSelection = useCallback((uid: string) => {
        setSelectedUserIds(prev => 
            prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
        );
    }, []);

    const selectAllUsers = useCallback((selected: boolean) => {
        if (selected) {
            setSelectedUserIds(users.map(u => u.uid));
        } else {
            setSelectedUserIds([]);
        }
    }, [users]);

    const handleAction = useCallback(async (action: string, user: any) => {
        setSelectedUser(user);
        setActiveModal(action);
    }, []);

    const handleBulkAction = useCallback((action: string) => {
        if (isVendor) return;
        
        if (action === 'notify') {
            setSelectedUser({ firstName: `${selectedUserIds.length} seleccionados` });
        }
        
        setActiveModal(action);
    }, [isVendor, selectedUserIds.length]);

    const handleConfirmBulkAction = async () => {
        if (isVendor) return;
        
        const actionMapping: Record<string, string> = {
            'change-role': 'CHANGE_ROLE',
            'change-plan': 'CHANGE_PLAN',
            'deactivate': 'DEACTIVATE',
            'activate': 'ACTIVATE',
            'reset-pwd': 'RESET_PASSWORD',
            'delete': 'DELETE'
        };

        const apiAction = actionMapping[activeModal!];
        if (!apiAction) return;

        const needsValue = activeModal === 'change-role' || activeModal === 'change-plan';
        if (needsValue && !bulkValue) {
            showNotification('Atención', 'Debes seleccionar una opción', 'warning');
            return;
        }

        let payload: any = {};
        if (activeModal === 'change-role') payload = { newRole: bulkValue.toUpperCase() };
        if (activeModal === 'change-plan') payload = { newPlan: bulkValue.toUpperCase() };

        setIsLoading(true);
        try {
            const response = await AdminUserService.bulkAction(apiAction, selectedUserIds, payload);
            
            showNotification('Éxito', `Se procesaron ${response.successCount} usuarios exitosamente`, 'success');
            setSelectedUserIds([]);
            setActiveModal(null);
            setBulkValue('');
            fetchUsers(1, false);
            AdminUserService.getStats().then(setStats);
        } catch (error) {
            showNotification('Error', 'No se pudo completar la acción masiva', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            if (activeModal === 'activate') {
                await AdminUserService.activate(selectedUser.uid);
                showNotification('Éxito', 'Usuario activado correctamente', 'success');
            } else {
                await AdminUserService.deactivate(selectedUser.uid);
                showNotification('Éxito', 'Usuario desactivado correctamente', 'success');
            }
            setActiveModal(null);
            setSelectedUser(null);
            fetchUsers(1, false);
            AdminUserService.getStats().then(setStats);
        } catch (error) {
            showNotification('Error', 'No se pudo cambiar el estado del usuario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            await AdminUserService.delete(selectedUser.uid);
            showNotification('Éxito', 'Usuario eliminado correctamente', 'success');
            setActiveModal(null);
            setSelectedUser(null);
            fetchUsers(1, false); 
            setLoadingStats(true);
            AdminUserService.getStats()
                .then(setStats)
                .finally(() => setLoadingStats(false));
        } catch (error) {
            showNotification('Error', 'No se pudo eliminar el usuario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            const response = await AdminUserService.resetPassword(selectedUser.uid);
            showNotification('Éxito', response.message, 'success');
            setActiveModal(null);
            setSelectedUser(null);
        } catch (error) {
            showNotification('Error', 'No se pudo enviar el correo de recuperación', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserCreated = (newUser: any) => {
        const userUI = mapAdminUserToUI(newUser);
        setUsers(prev => [userUI, ...prev]);
        setTotalItems(prev => prev + 1);
    };

    const handleUserUpdated = (updatedUser: any) => {
        const userUI = mapAdminUserToUI(updatedUser);
        setUsers(prev => prev.map(u => u.uid === userUI.uid ? userUI : u));
    };

    const [isLoading, setIsLoading] = useState(false);

    return {
        users, stats, loading, isFetchingMore, totalItems,
        searchTerm, setSearchTerm, filters, handleFilterChange, clearFilters,
        selectedUserIds, setSelectedUserIds, toggleUserSelection, selectAllUsers,
        isModalOpen, setIsModalOpen,
        activeModal, setActiveModal, selectedUser,
        handleLoadMore, handleAction, handleBulkAction, handleConfirmBulkAction, handleDeleteUser, handleResetPassword, handleToggleStatus,
        handleUserCreated,
        handleUserUpdated,
        bulkValue, setBulkValue,
        handleSort,
        isVendor, isLoading, loadingStats
    };
};
