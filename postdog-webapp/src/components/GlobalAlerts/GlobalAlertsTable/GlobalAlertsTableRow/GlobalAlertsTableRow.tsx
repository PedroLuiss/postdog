import React from 'react';
import { Popover } from '@mui/material';
import { Calendar, Trash2, Pencil, EllipsisVertical, Pin } from 'lucide-react';
import styles from '../GlobalAlertsTable.module.scss';
import { GlobalAlertsTableRowProps } from './types';
import SwitchUi from '../../../ui/SwitchUi/SwitchUi';
import { formatDateNotificationGlobal } from '../../../../utils';
import { useGlobalAlertsRow } from './hooks/useGlobalAlertsRow';
import { getNotificationIcon } from '../../../../utils/getNotificationIcon.utils';


export const GlobalAlertsTableRow = React.memo(({ alert, onDelete, onEdit, onReschedule, onTogglePin, isReadOnly = false }: GlobalAlertsTableRowProps) => {
    const { anchorEl, isUpdatingPin, isOpen, priorityKey, isSent, handleClick, handleClose, handleTogglePin } = useGlobalAlertsRow(alert, onTogglePin);

    return (
        <tr className={styles['global-alerts-table__tr']}>
            <td className={`${styles['global-alerts-table__td']} ${styles['global-alerts-table__td--center']}`}>
                <SwitchUi checked={!!alert.isPinned} onChange={handleTogglePin} disabled={isUpdatingPin || isReadOnly} />
            </td>
            <td className={styles['global-alerts-table__td']}>
                <div className={styles['alert-title-cell']}>
                    <div className={styles['alert-title-cell__icon-box']}>
                        {getNotificationIcon(true, alert.icon || '', 16)}
                    </div>
                    <div className={styles['alert-title-cell__info']}>
                        <p className={styles['alert-title-cell__text']}>{alert.title}</p>
                        {alert.isPinned && (
                            <span className={styles['alert-title-cell__pinned']}>
                                <Pin size={12} /> Fijada
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className={`${styles['global-alerts-table__td']} ${styles['global-alerts-table__td--hide-md']} ${styles['global-alerts-table__td--message']}`}>
                <p className={styles['global-alerts-table__message-truncate']}>{alert.message}</p>
            </td>
            <td className={`${styles['global-alerts-table__td']} ${styles['global-alerts-table__td--hide-sm']}`}>
                <div className={`${styles['priority-badge']} ${styles[`priority-badge--${priorityKey}`]}`}>
                    {alert.priority?.toLowerCase() === 'high' ? 'Alta' : alert.priority?.toLowerCase() === 'medium' ? 'Media' : 'Baja'}
                </div>
            </td>
            <td className={`${styles['global-alerts-table__td']} ${styles['global-alerts-table__td--hide-lg']}`}>
                <div className={styles['date-status-cell']}>
                    <div className={styles['date-status-cell__date']}>
                        <Calendar size={14} />
                        {formatDateNotificationGlobal(alert.sendAt)}
                    </div>
                    {isSent && (
                        <span className={styles['date-status-cell__badge']}>Enviada</span>
                    )}
                </div>
            </td>
            {!isReadOnly && (
                <td className={`${styles['global-alerts-table__td']} ${styles['global-alerts-table__td--right']}`}>
                    <button 
                        className={styles['action-menu__trigger']}
                        onClick={handleClick}
                        aria-label="Acciones"
                    >
                        <EllipsisVertical size={16} />
                    </button>
                    
                    <Popover
                        open={isOpen}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ className: styles['action-menu__dropdown-portal'] }}
                        elevation={0}
                    >
                        <div className={styles['action-menu__dropdown-content']}>
                            {!isSent && (
                                <>
                                <div className={styles['action-menu__item']} onClick={() => { onEdit?.(alert.uid); handleClose(); }}>
                                    <Pencil size={16} /> <span>Editar</span>
                                </div>
                                <div className={styles['action-menu__item']} onClick={() => { onReschedule?.(alert.uid); handleClose(); }}>
                                    <Calendar size={16} /><span>Reprogramar</span>
                                </div>
                                </>
                            )}
                            <div className={`${styles['action-menu__item']} ${styles['action-menu__item--delete']}`} onClick={() => { onDelete?.(alert.uid); handleClose(); }}>
                                <Trash2 size={16} /> <span>Eliminar</span>
                            </div>
                        </div>
                    </Popover>
                </td>
            )}
        </tr>
    );
});
