import React from 'react';
import { PreferentialRatesNoteProps } from '../../Type/PreferentialRatesModal.Type';
import styles from '../../PreferentialRatesModal.module.scss';

export const PreferentialRatesNote: React.FC<PreferentialRatesNoteProps> = ({ text }) => {
    const parts = text.split(':');
    return (
        <div className={styles['nota-importante']}>
            <p className={styles['texto-nota-importante']}>
                <strong>{parts[0]}:</strong>{parts[1]}
            </p>
        </div>
    );
};
