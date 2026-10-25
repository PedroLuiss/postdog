import React from 'react';
import styles from '../MovementsModal.module.scss';

interface StatBoxProps {
    label: string;
    value: string | number;
    className?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, className }) => (
    <div className={`${styles['stat-box']} ${className || ''}`}>
        <p className={styles['stat-box__label']}>{label}</p>
        <p className={styles['stat-box__value']}>{value}</p>
    </div>
);