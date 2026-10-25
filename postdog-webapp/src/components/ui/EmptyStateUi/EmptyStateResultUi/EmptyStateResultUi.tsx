import React from 'react';
import styles from './EmptyStateResultUi.module.scss';
import ButtonUi from '../../Button/ButtonUi';

interface EmptyStateResultUiProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'primary' | 'light';
    minHeight?: string | number;
}

export const EmptyStateResultUi: React.FC<EmptyStateResultUiProps> = ({
    title,
    description,
    icon,
    actionLabel,
    onAction,
    variant = 'light',
    minHeight
}) => {
    return (
        <div className={styles['empty-state-result']} style={{ minHeight }}>
            <div className={styles['empty-state-result__content']}>
                <div className={styles['empty-state-result__icon-circle']}>
                    {icon}
                </div>

                <div className={styles['empty-state-result__text-group']}>
                    <h3 className={styles['empty-state-result__title']}>
                        {title}
                    </h3>
                    <p className={styles['empty-state-result__description']}>
                        {description}
                    </p>
                </div>

                {actionLabel && onAction && (
                    <div className={styles['empty-state-result__actions']}>
                        <ButtonUi 
                            variant={variant} 
                            onClick={onAction}
                        >
                            {actionLabel}
                        </ButtonUi>
                    </div>
                )}
            </div>
        </div>
    );
};