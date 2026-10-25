import React from 'react';
import { PreferentialRatesHeaderProps } from '../../Type/PreferentialRatesModal.Type';
import styles from '../../PreferentialRatesModal.module.scss';

export const PreferentialRatesHeader: React.FC<PreferentialRatesHeaderProps> = ({ title, description }) => (
    <div className={styles['modal-header']}>
        <h2 className={styles['modal-titulo']}>{title}</h2>
        <p className={styles['modal-descripcion']}>{description}</p>
    </div>
);
