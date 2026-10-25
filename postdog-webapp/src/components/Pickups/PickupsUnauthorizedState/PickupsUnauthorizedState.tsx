import React from 'react';

//icons
import { TruckLineIcon } from '../../icons/TruckLineIcon';
import { PlusIcon } from '../../icons/PlusIcon';

//lucide icons
import { PawPrint } from 'lucide-react';

//styles
import styles from './PickupsUnauthorizedState.module.scss';

import { PickupsUnauthorizedStateProps } from '../../../types/pickups.type';
import { usePickupsUnauthorizedState } from '../../../hooks/usePickupsUnauthorizedState';

export const PickupsUnauthorizedState: React.FC<PickupsUnauthorizedStateProps> = ({
    title = 'Aún no tienes recolecciones programadas',
    description = 'Cuando programes una recolección, aquí podrás ver y administrar todas.',
    onAction
}) => {
    usePickupsUnauthorizedState();

    return (
        <div className={styles['unauthorized-state']}>
            <div className={styles['unauthorized-state__icon-wrapper']}>
                <div className={styles['unauthorized-state__main-icon']}>
                    <TruckLineIcon width={40} height={40} />
                </div>
                <div className={styles['unauthorized-state__badge']}>
                    <PawPrint size={16} />
                </div>
            </div>

            <h3 className={styles['unauthorized-state__title']}>{title}</h3>
            <p className={styles['unauthorized-state__description']}>{description}</p>

            {onAction && (
                <button className={styles['unauthorized-state__action-button']} onClick={onAction}>
                    <PlusIcon width={16} height={16} />
                    Programar recolección
                </button>
            )}
        </div>
    );
};
