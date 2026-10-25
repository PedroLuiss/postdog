import React from 'react';
import { PreferentialRatesGridProps } from '../../Type/PreferentialRatesModal.Type';
import { PreferentialRatesCard } from '../PreferentialRatesCard/PreferentialRatesCard';
import styles from '../../PreferentialRatesModal.module.scss';

export const PreferentialRatesGrid: React.FC<PreferentialRatesGridProps> = ({ tiers }) => (
    <div className={styles['niveles-grid']}>
        {tiers.map(tier => <PreferentialRatesCard key={tier.id} tier={tier} />)}
    </div>
);
