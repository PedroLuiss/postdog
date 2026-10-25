import React from 'react';
import styles from './BulkActionsBar.module.scss';
import type { BulkActionsBarProps } from './types';

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
    selectedCount, onAction, onCancel
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className={styles['bulk-actions']}>
            <div className={styles['bulk-actions__count']}>
                {selectedCount} {selectedCount === 1 ? 'seleccionado' : 'seleccionados'}
            </div>
            <div className={styles['bulk-actions__list']}>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('change-role')}>Cambiar rol</button>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('change-plan')}>Cambiar plan</button>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('notify')}>Notificar</button>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('activate')}>Activar</button>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('deactivate')}>Desactivar</button>
                <button className={styles['bulk-actions__btn']} onClick={() => onAction('reset-pwd')}>Restablecer contraseña</button>
                {/* <button className={styles['bulk-actions__btn']} onClick={() => onAction('delete')}>Eliminar</button> */}
                <button className={`${styles['bulk-actions__btn']} ${styles['bulk-actions__btn--cancel']}`} onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
};

