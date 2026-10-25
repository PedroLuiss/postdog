import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Popover } from '@mui/material';
import styles from '../../UserTable.module.scss';
import { MenuAction } from '../../MenuAction/MenuAction';
import { UserTableOptionsProps } from './types';
import { useUserTableOptions } from './hooks/useUserTableOptions'; 

export const UserTableOptions: React.FC<UserTableOptionsProps> = React.memo(({
    user,
    isInactive,
    isVendor,
    onAction,
    className
}) => {
    
    const {
        anchorEl,
        isOpen,
        handleOpenMenu,
        handleCloseMenu,
        handleActionClick,
        isAdmin
    } = useUserTableOptions(user, onAction);

    return (
        <>
            <button 
                className={`${styles['users-table-card__td--options']} ${className || ''}`}
                onClick={handleOpenMenu}
                disabled={isAdmin ? false : !isVendor || isInactive }
                style={{ cursor: isAdmin ? 'pointer' : (!isVendor || isInactive) ? 'not-allowed' : 'pointer' }}
            >
                <MoreVertical size={18} />
            </button>
            
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                onClick={(e) => e.stopPropagation()} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                elevation={2}
                PaperProps={{ style: { borderRadius: '8px', padding: '4px' } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '160px' }}>
                    {isInactive ? (
                        !isVendor && (
                            <MenuAction 
                                onClick={() => handleActionClick('activate')} 
                                label="Activar" 
                                color="#10b981" 
                            />
                        )
                    ) : (
                        <>
                            <MenuAction onClick={() => handleActionClick('movements')} label="Ver movimientos" />
                            <MenuAction 
                                onClick={() => handleActionClick('edit')} 
                                label={isVendor ? "Detalles de cuenta" : "Modificar cuenta"} 
                            />
                            <MenuAction 
                                onClick={() => handleActionClick('billing')} 
                                label="Datos facturación" 
                            />
                            {!isVendor && (
                                <>
                                    <MenuAction onClick={() => handleActionClick('notify')} label="Notificar" />
                                    <MenuAction onClick={() => handleActionClick('reset-pwd')} label="Restablecer contraseña" />
                                    <MenuAction onClick={() => handleActionClick('deactivate')} label="Desactivar" color="#f59e0b" />
                                    {/* <MenuAction onClick={() => handleActionClick('delete')} label="Eliminar" color="#ef4444" /> */}
                                </>
                            )}
                        </>
                    )}
                </div>
            </Popover>
        </>
    );
});

UserTableOptions.displayName = 'UserTableOptions';