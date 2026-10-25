import React from 'react';
import styles from './ShipmentList.module.scss';
import ShipmentItem from './ShipmentItem/ShipmentItem';
import ShipmentEmptyState from '../ShipmentEmptyState/ShipmentEmptyState';

import { IOrder } from '../../../types';

interface ShipmentListProps {
    data: IOrder[];
    selectedIds: string[];
    onSelectItem: (id: string) => void;
    onClearFilters: () => void;
    onRefresh?: () => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ data, selectedIds, onSelectItem, onClearFilters, onRefresh }) => {
    if (data.length === 0) {
        return <ShipmentEmptyState onClear={onClearFilters} />;
    }

    return (
        <div className={styles['shipment-list']}>
            {data.map((shipment) => (
                <ShipmentItem 
                    key={shipment.uid} 
                    data={shipment} 
                    isSelected={selectedIds.includes(shipment.uid)}
                    onSelect={() => onSelectItem(shipment.uid)}
                    onRefresh={onRefresh}
                />
            ))}
        </div>
    );
};