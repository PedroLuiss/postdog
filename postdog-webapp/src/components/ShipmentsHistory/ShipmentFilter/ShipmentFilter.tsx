import React from 'react';
import { Download, Upload, Check, Filter as FilterIcon } from 'lucide-react';
import styles from './ShipmentFilter.module.scss';
import ButtonUi from '../../ui/Button/ButtonUi';
import { FilterUi } from '../../ui';
import { FilterSelectField } from './FilterSelectField';
import { CustomDateRange } from './CustomDateRange';
import * as CONST from './constant/ShipmentFilter.constants';
import { ShipmentFilterProps } from './types/ChipmentFilter.type';
import { useShipmentFilter } from './Hooks/useShipmentFilter';

export const ShipmentFilter: React.FC<ShipmentFilterProps> = (props) => {
    const {
        loadedCount, selectedCount, onSearch, searchTerm, isFilterOpen,
        onFilterToggle, onSelectAll, isAllSelected, onDownload, onImport,
        filters, onClearFilters
    } = props;

    const {
        activeSelect, setActiveSelect, openCalendar, setOpenCalendar,
        popoverRef, activeFiltersCount, handleSelectOption, handleDateSelect
    } = useShipmentFilter(filters, props.onFilterChange, props.onFilterClose, isFilterOpen);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day)}/${parseInt(month)}/${year}`;
    };

    return (
        <div className={styles['shipment-filter']}>
            <div className={styles['shipment-filter__container']}>
                <FilterUi className={styles['shipment-filter__search-row']}>
                    <FilterUi.Search
                        placeholder="Buscar por número de orden, nombre del destinatario, código postal o número de rastreo"
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className={styles['shipment-filter__search-wrapper']}
                    />

                    <div className={styles['shipment-filter__popover-wrapper']} ref={popoverRef}>
                        <ButtonUi variant="light" icon={<FilterIcon size={16} />} onClick={onFilterToggle}>
                            Filtrar
                            {activeFiltersCount > 0 && <span className={styles['shipment-filter__badge']}>{activeFiltersCount}</span>}
                        </ButtonUi>

                        {isFilterOpen && (
                            <div className={styles['shipment-popover']}>
                                <div className={styles['shipment-popover__header']}>
                                    <h4 className={styles['shipment-popover__title']}>Filtros</h4>
                                    {activeFiltersCount > 0 && (
                                        <button type="button" className={styles['shipment-popover__clear-btn']} onClick={onClearFilters}>Limpiar</button>
                                    )}
                                </div>

                                <div className={styles['shipment-popover__content']}>
                                    <FilterSelectField label="Paquetería" field="carrier" options={CONST.CARRIER_OPTIONS} currentValue={filters.carrier} activeSelect={activeSelect} onToggle={setActiveSelect} onSelect={handleSelectOption} />
                                    <FilterSelectField label="Estatus del envío" field="status" options={CONST.STATUS_OPTIONS} currentValue={filters.status} activeSelect={activeSelect} onToggle={setActiveSelect} onSelect={handleSelectOption} />
                                    <FilterSelectField label="Seguro (PawSafe)" field="insurance" options={CONST.INSURANCE_OPTIONS} currentValue={filters.insurance} activeSelect={activeSelect} onToggle={setActiveSelect} onSelect={handleSelectOption} />
                                    <FilterSelectField label="Ordenar por" field="sort" options={CONST.SORT_OPTIONS} currentValue={filters.sort} activeSelect={activeSelect} onToggle={setActiveSelect} onSelect={handleSelectOption} />
                                    <FilterSelectField label="Mostrar guías por fecha" field="date" options={CONST.DATE_OPTIONS} currentValue={filters.date} activeSelect={activeSelect} onToggle={setActiveSelect} onSelect={handleSelectOption} />

                                    {filters.date === 'Personalizado' && (
                                        <CustomDateRange filters={filters} openCalendar={openCalendar} onToggleCalendar={setOpenCalendar} onDateSelect={handleDateSelect} formatDate={formatDate} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </FilterUi>

                <div className={styles['shipment-filter__actions-row']}>
                    <div className={styles['shipment-filter__select-all']} onClick={onSelectAll}>
                        <div className={`${styles['shipment-filter__checkbox']} ${isAllSelected ? styles['shipment-filter__checkbox--checked'] : ''}`}>
                            {isAllSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                        <label className={styles['shipment-filter__checkbox-label']}>Seleccionar todas las guías ({loadedCount})</label>
                    </div>

                    <div className={styles['shipment-filter__buttons-group']}>
                        <ButtonUi variant="light" className={styles['shipment-filter__download-btn']} icon={<Download size={16} />} disabled={selectedCount === 0} onClick={onDownload} >
                            <div className={styles['shipment-filter__btn-text']}>Descargar guías </div>
                            {selectedCount > 0 && <div className={styles['shipment-filter__count']}> ({selectedCount})</div>}
                        </ButtonUi>
                        <ButtonUi className={styles['shipment-filter__import-btn']} variant="primary" icon={<Upload size={16} />} onClick={onImport} >
                            <span className={styles['shipment-filter__btn-text']}>Importar envíos</span>
                        </ButtonUi>
                    </div>
                </div>
            </div>
        </div>
    );
};