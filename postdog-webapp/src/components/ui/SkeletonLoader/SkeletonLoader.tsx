import React from 'react';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import styles from './SkeletonLoader.module.scss';

interface SkeletonLoaderProps {
    count?: number;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
    spacing?: number;
    type?: 'table' | 'content-progress' | 'order-card' | 'pickup-card' | 'wallet';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count = 1,
    width = '100%',
    height = 40,
    variant = 'rectangular',
    spacing = 1,
    type = 'table'
}) => {

    switch (type) {
        case 'table':
            return (
                <Box sx={{ width }}>
                    <Skeleton
                        className='mb-3'
                        variant={variant}
                        width={'100%'}
                        height={60}
                    />
                    {Array.from({ length: count }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant={variant}
                            height={height}
                            sx={{ mb: spacing }}
                        />
                    ))}
                </Box>
            );

        case 'content-progress':
            return (
                <Box
                    sx={{
                        width: width,
                        height: '-webkit-fill-available',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1e1e1e1c',
                        position: 'absolute',
                        zIndex: '111'
                    }}
                >
                    <CircularProgress color="primary" />
                </Box>
            );

        case 'order-card':
            return (
                <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Array.from({ length: count }).map((_, index) => (
                        <div key={index} className={styles['skeleton-order-card']}>
                            <div className={styles['skeleton-order-card__content']}>
                                <div className={styles['skeleton-order-card__header']}>
                                    <Skeleton variant="circular" width={24} height={24} />
                                    <Skeleton variant="text" width={60} height={24} />
                                    <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 4 }} />
                                </div>

                                <div className={styles['skeleton-order-card__details-grid']}>
                                    <div className={styles['skeleton-order-card__section']}>
                                        <Skeleton variant="text" width={50} height={16} />
                                        <Skeleton variant="text" width={120} height={20} />
                                        <Skeleton variant="text" width={80} height={16} />
                                    </div>

                                    <div className={styles['skeleton-order-card__section']}>
                                        <Skeleton variant="text" width={60} height={16} />
                                        <Skeleton variant="text" width={90} height={20} />
                                    </div>

                                    <div className={styles['skeleton-order-card__section']}>
                                        <Skeleton variant="text" width={80} height={16} />
                                        <Skeleton variant="text" width={100} height={20} />
                                        <Skeleton variant="text" width={40} height={16} />
                                    </div>
                                </div>
                                <div className={styles['skeleton-order-card__footer']}>
                                    <Skeleton variant="text" width={140} height={16} />
                                </div>
                            </div>

                            <div className={styles['skeleton-order-card__actions']}>
                                <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 1 }} />
                                <Skeleton variant="circular" width={24} height={24} />
                            </div>
                        </div>
                    ))}
                </Box>
            );

        case 'pickup-card':
            return (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Array.from({ length: count }).map((_, index) => (
                        <div key={index} className={styles['skeleton-pickup-card']}>
                            <div className={styles['skeleton-pickup-card__content']}>
                                <div className={`${styles['skeleton-pickup-card__col']} ${styles['skeleton-pickup-card__col--number']}`}>
                                    <Skeleton variant="text" width={80} height={20} />
                                </div>
                                <div className={`${styles['skeleton-pickup-card__col']} ${styles['skeleton-pickup-card__col--carrier']}`}>
                                    <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
                                </div>
                                <div className={`${styles['skeleton-pickup-card__col']} ${styles['skeleton-pickup-card__col--address']}`}>
                                    <Skeleton variant="text" width="90%" height={20} />
                                    <Skeleton variant="text" width="60%" height={20} />
                                </div>
                                <div className={`${styles['skeleton-pickup-card__col']} ${styles['skeleton-pickup-card__col--date']}`}>
                                    <Skeleton variant="text" width={60} height={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </Box>
            );
        case 'wallet':
            return (
                <Skeleton
                    variant="rectangular"
                    width={width}
                    height={height}
                    sx={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        margin: 0,
                        transform: 'none',
                        borderRadius: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        minHeight: 0
                    }}
                />
            );
        default:
            return (
                <Skeleton
                    variant={variant}
                    width={width}
                    height={height}
                    sx={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        margin: 0,
                        transform: 'none',
                        minHeight: 0
                    }}
                />
            );
    }

};
