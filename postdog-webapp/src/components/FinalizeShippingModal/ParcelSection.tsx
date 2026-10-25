
import React from 'react';

import styles from './FinalizeShippingModal.module.scss';
import { ShippingOption, SortConfig } from '../../types';
import { ShippingOptions } from '../ShippingQuote/Steps/Three/Table/ShippingOptions';
import { EditIcon, TruckIcon } from '../icons';

interface ParcelSectionProps {
    isEditing: boolean;
    options: ShippingOption[];
    selectedOption?: ShippingOption;
    sortConfig: SortConfig;
    handlers: {
        onEdit: () => void;
        onSelect: (id: string) => void;
        onSort: (key: 'estimatedDelivery' | 'price') => void;
        isFilterOpen: boolean;
        setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
        availableCarriers: string[];
        selectedCarriers: string[];
        setSelectedCarriers: React.Dispatch<React.SetStateAction<string[]>>;
    }
}

export const ParcelSection: React.FC<ParcelSectionProps> = ({ isEditing, options, selectedOption, sortConfig, handlers }) => {
   
    return (
        <section className={styles['courier-details']}>
            {isEditing ? (
                <ShippingOptions
                    options={options}
                    selectedOptionId={selectedOption?.id || null}
                    onSelectOption={handlers.onSelect}
                    onSort={handlers.onSort}
                    sortConfig={sortConfig}
                    isFilterOpen={handlers.isFilterOpen} onFilterToggle={() => handlers.setIsFilterOpen(!handlers.isFilterOpen)} onFilterClose={() => handlers.setIsFilterOpen(false)}
                    availableCarriers={handlers.availableCarriers} selectedCarriers={handlers.selectedCarriers} onFilterChange={handlers.setSelectedCarriers}
                />
            ) : (
                <div className={styles['courier-details__main-content']}>
                    <div className={styles['courier-details__header']}>
                        <TruckIcon />
                        <h3 className={styles['courier-details__title']}>Paquetería</h3>
                    </div>
                    {selectedOption && (
                        <div className={styles['courier-details__body-main']}>
                            <div className={styles['courier-details__body']}>
                                <div className={styles['courier-details__info']}>
                                    <img src={selectedOption.logo} alt={`${selectedOption.carrier} logo`} className={styles['courier-details__logo']} />
                                    <div className={styles['courier-details__text-group']}>
                                        <h4>{selectedOption.carrier} {selectedOption.service}</h4>
                                        <p>Recolección: {selectedOption.collection}</p>
                                        <p>Entrega estimada: {selectedOption.estimatedDelivery}</p>
                                    </div>
                                </div>
                                <div className={styles['courier-details__price']}>
                                    <p>Precio: ${selectedOption.price.toFixed(2)} MXN</p>
                                </div>
                            </div>
                            <button onClick={handlers.onEdit} className={styles['courier-details__edit-button']}>
                                <EditIcon /> Editar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}