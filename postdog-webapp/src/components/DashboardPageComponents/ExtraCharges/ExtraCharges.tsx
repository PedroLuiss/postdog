import React from 'react';

//Components
import InfoTooltip from '../../ui/InfoTooltip/InfoTooltip';

//Styles
import styles from './ExtraCharges.module.scss';

//Types
import { ExtraChargesProps } from '../../../types/dashboard.type';
import { StatsOverviewSkeleton } from '../../ui/SkeletonUi/StatsOverviewSkeleton/StatsOverviewSkeleton';


const ExtraCharges: React.FC<ExtraChargesProps> = ({ balance, isLoadingMetrics = false }) => {
    if (isLoadingMetrics) {
        return <StatsOverviewSkeleton count={1} className={styles.sectionCard__skeleton} />;
    }
    return (
        <div className={styles.sectionCard}>
            <h3 className={styles.sectionCard__title}>
                Cargos extras pendientes de pago
                <InfoTooltip title="El adeudo se cobrará automáticamente en tu próxima recarga." classNameInfoIcon={styles.infoIcon} />
            </h3>
            <div className={styles.amount}>
                <span className={styles.currencySymbol}>$</span>
                <span className={styles.value}>{balance}</span>
                <span className={styles.currencyCode}>MXN</span>
            </div>
        </div>
    );
};

export default ExtraCharges;
