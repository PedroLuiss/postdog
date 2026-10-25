import React from 'react';
import StatsCard from '../StatsCard/StatsCard';
import styles from './StatsOverview.module.scss';
import { StatsOverviewProps } from './types';
import { StatsOverviewSkeleton } from '../../ui/SkeletonUi/StatsOverviewSkeleton/StatsOverviewSkeleton';
const StatsOverview: React.FC<StatsOverviewProps> = ({ statsCards, isLoadingMetrics }) => {
    if (isLoadingMetrics) {
        return <StatsOverviewSkeleton count={4} />;
    }
    return (
        <div className={styles['stats-overview']}>
            {statsCards.map((card, index) => (
                <StatsCard
                    key={index}
                    label={card.label}
                    value={card.value}
                    subtitle={card.subtitle}
                    icon={card.icon}
                />
            ))}
        </div>
    );
};

export default StatsOverview;