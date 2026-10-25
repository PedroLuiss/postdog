import React from 'react';

//Styles
import styles from './QuickActionItem.module.scss';

//Types
import { QuickActionItemProps } from '../../../types/dashboard.type';

const QuickActionItem: React.FC<QuickActionItemProps> = ({ label, icon, onClick }) => {
    return (
        <div className={styles.quickActionItem} onClick={onClick}>
            <div className={styles.icon}>
                {icon}
            </div>
            <p className={styles.label}>{label}</p>
        </div>
    );
};

export default QuickActionItem;
