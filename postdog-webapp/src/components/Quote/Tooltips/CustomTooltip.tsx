import React, { useState, ReactNode } from 'react';
import styles from './CustomTooltip.module.scss';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface CustomTooltipProps {
    children: ReactNode;
    content: ReactNode;
    placement?: TooltipPlacement;
    className?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
    children, 
    content, 
    placement = 'top',
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const tooltipClassName = `${styles['custom-tooltip']} ${styles[`custom-tooltip--${placement}`]}`;
    const containerClassName = `${styles['tooltip-container']} ${className}`.trim();

    return (
        <div 
            className={containerClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children} 
            
            {isVisible && (
                <div className={tooltipClassName}>
                    {content}
                </div>
            )}
        </div>
    );
};