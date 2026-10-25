import React from 'react';
import { Search, X, Calendar as CalendarIcon } from 'lucide-react';
import styles from './UserFilters.module.scss';
import SelectUi from '../../ui/SelectUi/SelectUi';
import { UserFiltersProps } from './types/UserFilters.types';
import { CalendarUi } from '../../ui/CalendarUi/CalendarUi';
import { useUserFilters } from './hooks/useUserFilters';

export const UserFilters: React.FC<UserFiltersProps> = ({
    searchTerm, setSearchTerm, filters, onFilterChange, onClear, totalItems
}) => {
    
    const {
        openCalendar,
        hasActiveFilters,
        formatDate,
        handleDateSelect,
        toggleCalendar
    } = useUserFilters(searchTerm, filters, onFilterChange);

    return (
        <div className={styles['users-filter']}>
            
            <div className={styles['users-filter__search-wrapper']}>
                <Search className={styles['users-filter__search-icon']} />
                <input 
                    type="text" 
                    className={styles['users-filter__input']} 
                    placeholder="Buscar por nombre, correo o teléfono..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles['users-filter__grid']}>
                <SelectUi
                    name="verification"
                    className={styles['filter-select-custom']}
                    value={filters.verification}
                    onChange={(e) => onFilterChange('verification', e.target.value)}
                    options={[
                        { value: 'all', label: 'Verificación: Todos' },
                        { value: 'verified', label: 'Verificados' },
                        { value: 'unverified', label: 'Sin verificar' },
                    ]}
                />
                <SelectUi
                    name="plan"
                    className={styles['filter-select-custom']}
                    value={filters.plan}
                    onChange={(e) => onFilterChange('plan', e.target.value)}
                    options={[
                        { value: 'all', label: 'Plan: Todos' },
                        { value: 'chihuahua', label: 'Chihuahua' },
                        { value: 'pug', label: 'Pug' },
                        { value: 'husky', label: 'Husky' },
                        { value: 'pitbull', label: 'Pitbull' },
                    ]}
                />
                <SelectUi
                    name="role"
                    className={styles['filter-select-custom']}
                    value={filters.role}
                    onChange={(e) => onFilterChange('role', e.target.value)}
                    options={[
                        { value: 'all', label: 'Rol: Todos' },
                        { value: 'admin', label: 'Administrador' },
                        { value: 'user', label: 'Usuario' },
                        { value: 'vendor', label: 'Vendor' },
                    ]}
                />
                <SelectUi
                    name="status"
                    className={styles['filter-select-custom']}
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    options={[
                        { value: 'all', label: 'Estatus: Todos' },
                        { value: 'active', label: 'Activos' },
                        { value: 'inactive', label: 'Inactivos' },
                    ]}
                />

                <SelectUi
                    name="dateType"
                    className={styles['filter-select-custom']}
                    value={filters.dateType}
                    onChange={(e) => onFilterChange('dateType', e.target.value)}
                    options={[
                        { value: 'all', label: 'Fecha: Todos' },
                        { value: 'registration', label: 'Registro' },
                        { value: 'last_shipment', label: 'Último envío' },
                        { value: 'last_activity', label: 'Última actividad' },
                    ]}
                />

                <div className={styles['users-filter__date-range']}>
                    {['startDate', 'endDate'].map((key) => (
                        <div key={key} className={styles['users-filter__date-input-wrapper']}>
                            <button
                                type="button"
                                className={styles['users-filter__date-field']}
                                onClick={() => toggleCalendar(key)}
                            >
                                <CalendarIcon size={14} />
                                {filters[key] ? formatDate(filters[key]) : (key === 'startDate' ? 'Desde' : 'Hasta')}
                            </button>
                            {openCalendar === key && (
                                <CalendarUi
                                    selectedDate={filters[key]}
                                    onSelect={(date) => handleDateSelect(key, date)}
                                    align={key === 'endDate' ? 'right' : 'left'}
                                    className={`${styles['users-filter__calendar-popup']} ${key === 'endDate' ? styles['users-filter__calendar-popup--right'] : ''}`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles['users-filter__footer']}>
                <span>{totalItems} usuarios encontrados</span>
                {hasActiveFilters && (
                    <button className={styles['users-filter__clear-btn']} onClick={onClear}>
                        <X /> Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
};