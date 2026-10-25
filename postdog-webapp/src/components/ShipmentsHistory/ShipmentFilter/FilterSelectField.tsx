import { ChevronDown, Check } from 'lucide-react';
import styles from './ShipmentFilter.module.scss';

export const FilterSelectField = ({ label, field, options, currentValue, activeSelect, onToggle, onSelect }: any) => (
    <div className={styles['shipment-popover__field']}>
        <label className={styles['shipment-popover__label']}>{label}</label>
        <div className={styles['shipment-popover__select-wrapper']}>
            <button type="button" className={styles['shipment-popover__select-trigger']} onClick={() => onToggle(activeSelect === field ? null : field)}>
                <span>{currentValue}</span>
                <ChevronDown size={14} className={styles['shipment-popover__select-icon']} />
            </button>
            {activeSelect === field && (
                <div className={styles['shipment-popover__dropdown-list']}>
                    {options.map((opt: string) => (
                        <div 
                            key={opt} 
                            className={`${styles['shipment-popover__option']} ${currentValue === opt ? styles['shipment-popover__option--active'] : ''}`} 
                            onClick={() => onSelect(field, opt)}
                        >
                            <span>{opt}</span>
                            {currentValue === opt && <Check size={14} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);