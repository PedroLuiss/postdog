import React, { useState, useRef } from 'react';
import styles from './FilterTooltip.module.scss';
import { useClickOutside } from '../../../hooks/useClickOutside';
import SearchIcon from '@mui/icons-material/Search';

interface FilterTooltipProps {
    onClose: () => void;
    couriers: string[];
    selectedCouriers: string[];
    onSelectionChange: (selected: string[]) => void;
}

export const FilterTooltip: React.FC<FilterTooltipProps> = ({ onClose, couriers, selectedCouriers, onSelectionChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const tooltipRef = useRef<HTMLDivElement>(null);

    useClickOutside<HTMLDivElement>(tooltipRef, onClose);

    const handleCheckboxChange = (courierName: string) => {
        const newSelection = new Set(selectedCouriers);
        if (newSelection.has(courierName)) {
            newSelection.delete(courierName);
        } else {
            newSelection.add(courierName);
        }
        onSelectionChange(Array.from(newSelection));
    };

    const filteredCouriers = couriers.filter(courier =>
        courier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles['filter-tooltip']} ref={tooltipRef}>
            <div className={styles['filter-tooltip__search-box']}>
                <SearchIcon />
                <input
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles['filter-tooltip__search-input']}
                />
            </div>
            <ul className={styles['filter-tooltip__courier-list']}>
                {filteredCouriers.map(courier => (
                    <li key={courier} className={styles['filter-tooltip__courier-item']}>
                        <label className={styles['filter-tooltip__label']}>
                            <input
                                type="checkbox"
                                checked={selectedCouriers.includes(courier)}
                                onChange={() => handleCheckboxChange(courier)}
                                className={styles['filter-tooltip__checkbox']}
                            />
                            {courier}
                        </label>
                    </li>
                ))}

                {filteredCouriers.length === 0 && (
                    <li className={styles['filter-tooltip__no-results']}>
                        No se encontraron resultados
                    </li>
                )}
            </ul>
        </div>
    );
};