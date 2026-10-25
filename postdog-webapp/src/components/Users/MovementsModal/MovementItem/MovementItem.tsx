import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { UserMovement } from '../../../../types';
import { formatDateNotificationGlobal } from '../../../../utils';
import styles from '../MovementsModal.module.scss';

interface MovementItemProps {
    movement: UserMovement;
}

export const MovementItem: React.FC<MovementItemProps> = ({ movement }) => {
    const isCredit = movement.type === 'CREDIT';
    
    return (
        <div className={styles['movement-item']}>
            <div className={styles['movement-item__left']}>
                <div className={`${styles['movement-item__icon']} ${isCredit ? styles['movement-item__icon--credit'] : styles['movement-item__icon--debit']}`}>
                    {isCredit ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div className={styles['movement-item__info']}>
                    <p className={styles['movement-item__ref']}>
                        {movement.referenceType === 'TOP_UP' ? 'Recarga de Saldo' : 
                         movement.referenceType === 'SHIPMENT' ? 'Pago de Envío' : 
                         movement.referenceType}
                    </p>
                    <p className={styles['movement-item__date']}>
                        {formatDateNotificationGlobal(movement.createdAt)}
                    </p>
                </div>
            </div>
            <div className={styles['movement-item__right']}>
                <p className={`${styles['movement-item__amount']} ${isCredit ? styles['movement-item__amount--credit'] : styles['movement-item__amount--debit']}`}>
                    {isCredit ? '+' : '-'}${Number(movement.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <span className={styles['movement-item__type']}>
                    {isCredit ? 'Abono' : 'Cargo'}
                </span>
            </div>
        </div>
    );
};