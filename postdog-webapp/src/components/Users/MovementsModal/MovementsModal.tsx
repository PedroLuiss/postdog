import React from 'react';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';
import styles from './MovementsModal.module.scss';
import { MovementsModalProps } from './types';
import { useMovementsModal } from './hooks/useMovementsModal';

import { StatBox } from './StatBox';
import { MovementItem } from './MovementItem';
import { MovementsModalSkeleton } from '../../ui/SkeletonUi/MovementsModalSkeleton/MovementsModalSkeleton';

export const MovementsModal: React.FC<MovementsModalProps> = ({ isOpen, onClose, user }) => {
    const { summary, isLoading } = useMovementsModal(user?.uid, isOpen);

    if (!user) return null;

    return (
        <DrawerModalUi
            isOpen={isOpen}
            onClose={onClose}
            title={`Movimientos - ${user.firstName} ${user.lastName}`}
            maxWidthLg="42rem"
        >
            <div className={styles['movements-modal__content']}>
                {isLoading ? (
                    <MovementsModalSkeleton />
                ) : (
                    <>
                        <div className={styles['movements-modal__stats-grid']}>
                            <StatBox 
                                label="Balance Actual" 
                                value={`$${Number(summary?.balance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} 
                            />
                            <StatBox 
                                label="Total Recargas" 
                                value={`$${Number(summary?.totalRecharges || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} 
                            />
                            <StatBox 
                                label="Total Cargos" 
                                value={`$${Number(summary?.totalCharges || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} 
                            />
                            <StatBox 
                                label="Número de Envíos" 
                                value={summary?.shipmentCount || 0} 
                            />
                            <StatBox 
                                label="Correo" 
                                value={user.email} 
                                className={styles['stat-box--full']}
                            />
                        </div>

                        <div className={styles['movements-modal__history']}>
                            <h4 className={styles['movements-modal__history-title']}>
                                Historial Reciente
                            </h4>
                            
                            {!summary?.movements || summary.movements.length === 0 ? (
                                <div className={styles['movements-modal__empty-state']}>
                                    No hay movimientos registrados para este usuario.
                                </div>
                            ) : (
                                <div className={styles['movements-modal__list']}>
                                    {summary.movements.map((movement: any) => (
                                        <MovementItem key={movement.uid} movement={movement} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DrawerModalUi>
    );
};