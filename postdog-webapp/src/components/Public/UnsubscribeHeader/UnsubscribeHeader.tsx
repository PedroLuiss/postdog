import React from 'react';
import styles from './UnsubscribeHeader.module.scss';
import logo from '../../../assets/Logos/PostDog-Logo.png';

import { useUnsubscribeHeader } from './hooks/useUnsubscribeHeader';

export const UnsubscribeHeader: React.FC = () => {
    const {
        goToHome,
    } = useUnsubscribeHeader();

    return (
        <header className={styles['unsubscribe-header']}>
            <div className={styles['unsubscribe-header__container']}>
                <div className={styles['unsubscribe-header__logo']} onClick={goToHome}>
                    <img src={logo} alt="Postdog Logo" className={styles['unsubscribe-header__logo-img']} />
                </div>
            </div>
        </header>
    );
};