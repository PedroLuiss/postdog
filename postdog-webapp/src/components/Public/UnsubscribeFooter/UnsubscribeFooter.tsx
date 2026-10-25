import React from 'react';
import styles from './UnsubscribeFooter.module.scss';

export const UnsubscribeFooter: React.FC = () => {
    return (
        <footer className={styles['unsubscribe-footer']}>
            <a href="/help">¿Necesitas ayuda?</a>
            <span className={styles['unsubscribe-dot']}>•</span>
            <a href="#">Política de privacidad</a>
        </footer>
    );
};
