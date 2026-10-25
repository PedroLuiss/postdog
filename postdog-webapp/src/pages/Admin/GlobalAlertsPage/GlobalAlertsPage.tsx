import React, { useMemo } from 'react';
import { Plus, Pin } from 'lucide-react';
import styles from './GlobalAlertsPage.module.scss';
import { GlobalAlertsTable, GlobalAlertsModal } from '../../../components/GlobalAlerts';
import { AlertDialogUi } from '../../../components/ui/AlertDialogUi/AlertDialogUi';
import InputUi from '../../../components/ui/Input/InputUi';
import { useGlobalAlertsPage } from './hooks/useGlobalAlertsPage';
import { useAppContext } from '../../../context/AppContext';

import { getNotificationIcon } from '../../../utils/getNotificationIcon.utils';

export const GlobalAlertsPage = () => {
    const { user } = useAppContext();
    const isVendor = user?.role?.toUpperCase() === 'VENDOR';

    const {
        alerts, loading, isFetchingMore, hasMore, observerTarget,
        isDrawerOpen, setIsDrawerOpen,
        alertToDelete, setAlertToDelete,
        alertToReschedule, setAlertToReschedule,
        selectedAlert,
        rescheduleDate, setRescheduleDate,
        isRescheduling,
        handleOpenCreate, handleOpenEdit, handleOpenReschedule,
        handleConfirmDelete, handleConfirmReschedule,
        handleSubmitForm, togglePin
    } = useGlobalAlertsPage();

    const pinnedAlerts = useMemo(() => alerts.filter(a => a.isPinned), [alerts]);

    return (
        <div className={styles['global-alerts']}>
            
            <div className={styles['global-alerts__header']}>
                <div className={styles['global-alerts__header-info']}>
                    <p className={styles['global-alerts__header-subtitle']}>
                        {isVendor 
                            ? "Historial de avisos globales enviados a los usuarios de Postdog (Modo lectura)."
                            : "Envía avisos globales a todos los usuarios de Postdog"
                        }
                    </p>
                </div>
                {!isVendor && (
                    <button 
                        className={styles['global-alerts__btn-add']}
                        onClick={handleOpenCreate}
                    >
                        <Plus size={18} />
                        Agregar nueva alerta
                    </button>
                )}
            </div>

            {pinnedAlerts.length > 0 && (
                <div className={styles['pinned-alerts']}>
                    <p className={styles['pinned-alerts__label']}>
                        Alertas fijadas ({pinnedAlerts.length}/3)
                    </p>
                    <div className={styles['pinned-alerts__list']}>
                        {pinnedAlerts.map((alert) => {
                            const priorityKey = alert.priority?.toLowerCase();
                            const cardClass = priorityKey === 'high' 
                                ? 'pinned-card--yellow' 
                                : priorityKey === 'medium' 
                                    ? 'pinned-card--red' 
                                    : 'pinned-card--black';

                            return (
                                <div key={alert.uid} className={`${styles['pinned-card']} ${styles[cardClass]}`}>
                                    <div className={styles['pinned-card__icon']}>
                                        {getNotificationIcon(true, alert.icon || '', 20)}
                                    </div>
                                    <div className={styles['pinned-card__content']}>
                                        <p className={styles['pinned-card__title']}>{alert.title}</p>
                                        <p className={styles['pinned-card__msg']}>{alert.message}</p>
                                    </div>
                                    <Pin className={styles['pinned-card__pin']} size={16} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className={styles['global-alerts__card']}>
                <GlobalAlertsTable 
                    alerts={alerts} 
                    onDelete={(uid) => setAlertToDelete(uid)}
                    onEdit={(uid) => handleOpenEdit(uid)}
                    onReschedule={(uid) => handleOpenReschedule(uid)}
                    onTogglePin={togglePin}
                    isFetchingMore={isFetchingMore}
                    hasMore={hasMore}
                    loading={loading}
                    observerTarget={observerTarget}
                    isReadOnly={isVendor}
                />
            </div>

            <GlobalAlertsModal 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                initialData={selectedAlert}
                onSubmit={handleSubmitForm}
            />

            <AlertDialogUi 
                isOpen={!!alertToDelete}
                onClose={() => setAlertToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Alerta"
                description="¿Estás seguro de que deseas eliminar esta alerta? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                isLoading={loading}
            />

            <AlertDialogUi 
                isOpen={!!alertToReschedule}
                onClose={() => setAlertToReschedule(null)}
                onConfirm={handleConfirmReschedule}
                title="Reprogramar Alerta"
                confirmLabel="Reprogramar"
                isLoading={isRescheduling}
            >
                <InputUi
                    label="Nueva fecha de envío"
                    name="rescheduleDate"
                    type="datetime-local"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    disabled={isRescheduling}
                    isValid={rescheduleDate.trim() !== ''}
                    showBadge={rescheduleDate.trim() !== ''}
                    showMessageError={false}
                />
            </AlertDialogUi>
        </div>
    );
};