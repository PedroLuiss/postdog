import React from 'react';
import { useTranslation } from 'react-i18next';

//Types
import { DashboardHeaderProps } from '../../../types/dashboard.type';

//Styles
import styles from './DashboardHeader.module.scss';

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.header}>
            <h1 className={styles.greeting}>{t('dashboard.greeting', { userName })}</h1>
            <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
        </div>
    );
};

export default DashboardHeader;
