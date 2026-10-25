import { Calendar as CalendarIcon } from 'lucide-react';
import { CalendarUi } from '../../ui/CalendarUi/CalendarUi';
import styles from './ShipmentFilter.module.scss';

export const CustomDateRange = ({ filters, openCalendar, onToggleCalendar, onDateSelect, formatDate }: any) => (
    <div className={styles['shipment-popover__date-range']}>
        <label className={styles['shipment-popover__date-label']}>Rango de fechas</label>
        <div className={styles['shipment-popover__date-inputs']}>
            {['startDate', 'endDate'].map((key) => (
                <div key={key} className={styles['shipment-popover__date-input-wrapper']}>
                    <button
                        type="button"
                        className={styles['shipment-popover__date-field']}
                        onClick={() => onToggleCalendar(openCalendar === key ? null : key)}
                    >
                        <CalendarIcon size={14} />
                        {filters[key] ? formatDate(filters[key]) : (key === 'startDate' ? 'Desde' : 'Hasta')}
                    </button>
                    {openCalendar === key && (
                        <CalendarUi
                            selectedDate={filters[key]}
                            onSelect={(date) => onDateSelect(key, date)}
                            align={key === 'endDate' ? 'right' : 'left'}
                        />
                    )}
                </div>
            ))}
        </div>
    </div>
);