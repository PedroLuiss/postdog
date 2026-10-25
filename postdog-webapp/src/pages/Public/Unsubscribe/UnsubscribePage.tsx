import React from 'react';
import styles from './UnsubscribePage.module.scss';
import { UnsubscribeHeader } from '../../../components/Public/UnsubscribeHeader/UnsubscribeHeader';
import { UnsubscribeContainer } from '../../../components/Public/UnsubscribeContainer/UnsubscribeContainer';
import { UnsubscribeFooter } from '../../../components/Public/UnsubscribeFooter/UnsubscribeFooter';

import { useUnsubscribePage } from './hooks/useUnsubscribePage';

export const UnsubscribePage: React.FC = () => {
    const { 
        status, 
        handleConfirm, 
        handleCancel, 
        goToHome, 
        resetStatus 
    } = useUnsubscribePage();

    return (
        <div className={styles['unsubscribe']}>
            <UnsubscribeHeader />
            
            <UnsubscribeContainer 
                status={status}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
                goToHome={goToHome}
                resetStatus={resetStatus}
            />

            <UnsubscribeFooter />
        </div>
    );
};