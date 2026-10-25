import React from 'react';
import styles from '../BillingDetailsModal.module.scss';

interface ReadOnlyFieldProps {
    label: string;
    value?: string | number | null;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => (
    <div className={styles['readonly-field']}>
        <label className={styles['readonly-field__label']}>{label}</label>
        <div className={styles['readonly-field__value']}>
            {value || 'No registrado'}
        </div>
    </div>
);