import { useState, useCallback } from 'react';
import { UserUI } from '../../../../../../types';
import { useAppContext } from '../../../../../../context/AppContext';

export const useUserTableOptions = (
    user: UserUI, 
    onAction: (action: string, user: UserUI) => void
) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const context = useAppContext();
    const userContext = context?.user?.user || context?.user;
    const isAdmin = userContext?.role_id === 'ADMIN';

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleActionClick = useCallback((action: string) => {
        onAction(action, user);
        handleCloseMenu();
    }, [onAction, user, handleCloseMenu]);

    const isOpen = Boolean(anchorEl);

    return {
        anchorEl,
        isOpen,
        handleOpenMenu,
        handleCloseMenu,
        handleActionClick,
        isAdmin
    };
};