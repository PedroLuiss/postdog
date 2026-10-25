import React from 'react';
import styles from './SkeletonUi.module.scss';

interface SkeletonUiProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const SkeletonUi: React.FC<SkeletonUiProps> = ({ width, height, borderRadius, className, style }) => {
    return (
        <span
            className={`${styles.skeleton} ${className || ''}`}
            style={{ width, height, borderRadius, ...style }}
        />
    );
};