import React from 'react';
import { Pencil, Trash2, CalendarClock, Calendar } from 'lucide-react';
import styles from '../GlobalAlertsTable.module.scss';
import SwitchUi from '../../../ui/SwitchUi/SwitchUi';
import { formatDateNotificationGlobal } from '../../../../utils';
import { useGlobalAlertsRow } from '../GlobalAlertsTableRow/hooks/useGlobalAlertsRow';
import { GlobalAlertsMobileCardProps } from './types';

export const GlobalAlertsMobileCard = React.memo(({ 
    alert, 
    onDelete, 
    onEdit, 
    onReschedule, 
    onTogglePin,
    isReadOnly = false 
}: GlobalAlertsMobileCardProps) => {
    const { isUpdatingPin, handleTogglePin } = useGlobalAlertsRow(alert, onTogglePin);

    const isFuture = alert.sendAt ? new Date(alert.sendAt).getTime() >= new Date().getTime() : false;

    return (
        <div className={styles['alert-card']}>
            <div className={styles['alert-card__header']}>
                <div className={styles['alert-card__info']}>
                    <div className={styles['alert-card__title']}>{alert.title}</div>
                    <div className={styles['alert-card__date']}>
                        <Calendar size={12} />
                        {formatDateNotificationGlobal(alert.sendAt)}
                    </div>
                </div>
                <div className={styles['alert-card__pin']}>
                    <SwitchUi 
                        checked={!!alert.isPinned} 
                        onChange={handleTogglePin}
                        aria-label="Fijar alerta"
                        disabled={isUpdatingPin || isReadOnly}
                    />
                </div>
            </div>
            <div className={styles['alert-card__message']}>{alert.message}</div>
            {!isReadOnly && (
                <div className={styles['alert-card__actions']}>
                    {isFuture && (
                        <>
                            <button className={styles['alert-card__btn']} onClick={() => onEdit?.(alert.uid)}>
                                <Pencil size={16} />
                            </button>
                            <button className={styles['alert-card__btn']} onClick={() => onReschedule?.(alert.uid)}>
                                <CalendarClock size={16} />
                            </button>
                        </>
                    )}
                    <button className={`${styles['alert-card__btn']} ${styles['alert-card__btn--delete']}`} onClick={() => onDelete?.(alert.uid)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
});
