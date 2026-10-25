import React from 'react';

// Styles
import styles from './FilterModal.module.scss';

// Icons
import { CalendarIcon } from '../../icons';

//Hook
import { useClickOutside } from '../../../hooks/useClickOutside';
import * as filterUtils from '../../../utils/filterUtils';

//components
import { FilterUi } from '../../ui/FilterUi/FilterUi';
import SelectUi from '../../ui/SelectUi/SelectUi';
import { CalendarUi } from '../../ui/CalendarUi/CalendarUi';

// Types
import { FilterModalProps, storeOptions } from '../../../types';

export const FilterModal: React.FC<FilterModalProps> = ({
    currentFilters,
    onChange,
    onClose
}) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const [openCalendar, setOpenCalendar] = React.useState<'startDate' | 'endDate' | null>(null);
    const startDateRef = React.useRef<HTMLDivElement>(null);
    const endDateRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);
    useClickOutside(startDateRef, () => {
        if (openCalendar === 'startDate') setOpenCalendar(null);
    });
    useClickOutside(endDateRef, () => {
        if (openCalendar === 'endDate') setOpenCalendar(null);
    });

    const dateRangeOptions = [
        'Todas',
        'Hoy',
        'Últimos 7 días',
        '30 días',
        '3 meses',
        'Personalizado'
    ];

    const storeSelectOptions = storeOptions.map(opt => ({ value: opt, label: opt }));
    const dateSelectOptions = dateRangeOptions.map(opt => ({ value: opt, label: opt }));

    const handleDateSelect = (field: 'startDate' | 'endDate', date: string) => {
        onChange({ ...currentFilters, [field]: date });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day)}/${parseInt(month)}/${year}`;
    };

    const showClear = (currentFilters.stores?.length > 0 && !currentFilters.stores.includes('Todos')) || currentFilters.dateRange?.[0] !== 'Todas';

    return (
        <div ref={modalRef}>
            <FilterUi.Modal
                title="Filtros"
                showClear={showClear}
                onClear={() => onChange({ ...currentFilters, stores: ['Todos'], dateRange: ['Todas'], startDate: '', endDate: '' })}
                className={styles['filter-modal__modal-override']}
            >
                <div className={styles['filter-modal__form-group']}>
                    <SelectUi
                        label="E-commerce"
                        options={storeSelectOptions}
                        value={currentFilters.stores?.[0] || 'Todos'}
                        className={styles['filter-modal__select-trigger']}
                        onChange={(e) => {
                            filterUtils.handleSingleFilterSelect('stores', e.target.value as string, currentFilters, onChange);
                        }}
                    />
                </div>

                <div className={styles['filter-modal__form-group']}>
                    <SelectUi
                        label="Mostrar pedidos por fecha"
                        options={dateSelectOptions}
                        value={currentFilters.dateRange?.[0] || 'Todas'}
                        className={styles['filter-modal__select-trigger']}
                        onChange={(e) => filterUtils.handleDateRangeChange(e.target.value as string, currentFilters, onChange)}
                    />
                </div>

                {currentFilters.dateRange?.[0] === 'Personalizado' && (
                    <div className={styles['filter-modal__date-range']}>
                        <p className={styles['filter-modal__date-label']}>Rango de fechas</p>
                        <div className={styles['filter-modal__date-inputs']}>
                            <div className={styles['filter-modal__date-input-wrapper']} ref={startDateRef}>
                                <div
                                    className={styles['filter-modal__date-field']}
                                    onClick={() => setOpenCalendar(openCalendar === 'startDate' ? null : 'startDate')}
                                >
                                    <CalendarIcon className={styles['filter-modal__calendar-icon']} />
                                    {currentFilters.startDate ? (
                                        <span className={styles['filter-modal__date-value']}>
                                            {formatDate(currentFilters.startDate)}
                                        </span>
                                    ) : (
                                        <span className={styles['filter-modal__date-placeholder-text']}>Desde</span>
                                    )}
                                </div>
                                {openCalendar === 'startDate' && (
                                    <CalendarUi
                                        selectedDate={currentFilters.startDate}
                                        onSelect={(date) => handleDateSelect('startDate', date)}
                                    />
                                )}
                            </div>
                            <div className={styles['filter-modal__date-input-wrapper']} ref={endDateRef}>
                                <div
                                    className={styles['filter-modal__date-field']}
                                    onClick={() => setOpenCalendar(openCalendar === 'endDate' ? null : 'endDate')}
                                >
                                    <CalendarIcon className={styles['filter-modal__calendar-icon']} />
                                    {currentFilters.endDate ? (
                                        <span className={styles['filter-modal__date-value']}>
                                            {formatDate(currentFilters.endDate)}
                                        </span>
                                    ) : (
                                        <span className={styles['filter-modal__date-placeholder-text']}>Hasta</span>
                                    )}
                                </div>
                                {openCalendar === 'endDate' && (
                                    <CalendarUi
                                        selectedDate={currentFilters.endDate}
                                        onSelect={(date) => handleDateSelect('endDate', date)}
                                        align="right"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </FilterUi.Modal>
        </div>
    );
};