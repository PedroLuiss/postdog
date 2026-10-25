import React from 'react';
import styles from './SavedAddresses.module.scss';
import { MapPinIcon, PawPrintIcon, PlusIconHome } from '../icons';
import { FilterUi } from '../ui/FilterUi/FilterUi';
import { AddressCard } from '../AddressCard/AddressCard';
import { SavedAddressesProps } from '../../types';
import { AnimatedListUi } from '../ui/AnimatedListUi/AnimatedListUi';

export const SavedAddresses: React.FC<SavedAddressesProps> = ({
    onAddAddress,
    addresses,
    filteredAddresses,
    searchTerm,
    setSearchTerm,
    selectedLabel,
    setSelectedLabel,
    handleDeleteAddress,
    handleEditAddress,
    toggleFavorite,
    error
}) => {
    if (error) return <div className={styles['saved-addresses']}>Error: {error}</div>;

    if (addresses.length === 0) {
        return (
            <div className={styles['saved-addresses']}>
                <div className={styles['saved-addresses__icon-container']}>
                    <div className={styles['saved-addresses__icon-circle']}>
                        <div className={styles['saved-addresses__main-icon']}>
                            <MapPinIcon size={40} color="white" />
                        </div>
                        <div className={styles['saved-addresses__sub-icon-circle']}>
                            <div className={styles['saved-addresses__sub-icon']}>
                                <PawPrintIcon size={16} color="#dc2626" />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className={styles['saved-addresses__title']}>Guarda tus direcciones frecuentes</h2>
                <p className={styles['saved-addresses__description']}>
                    Ahorra tiempo creando envíos más rápido al reutilizar<br />
                    direcciones de origen y destino.
                </p>

                <button
                    className={`${styles['saved-addresses__button']} ${styles['saved-addresses__button--primary']} `}
                    onClick={onAddAddress}
                >
                    <PlusIconHome size={16} /> Agregar dirección
                </button>
            </div>
        );
    }

    return (
        <div className={styles['saved-addresses-list-view']}>
            <div className={styles['filter-card']}>
                <FilterUi className={styles['content-wrapper']}>
                    <div className={styles['search-container']}>
                        <FilterUi.Search
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Escribe el alias o la dirección"
                        />
                    </div>

                    <FilterUi.Options className={styles['filters-group']}>
                        {(['Origen', 'Destino', 'Ambas'] as const).map((label) => (
                            <button
                                key={label}
                                className={`${styles['saved-addresses__label-btn']} ${selectedLabel === label ? styles['saved-addresses__label-btn--active'] : ''}`}
                                onClick={() => setSelectedLabel(selectedLabel === label ? '' : label)}
                            >
                                {label}
                            </button>
                        ))}
                    </FilterUi.Options>

                    <FilterUi.Actions className={styles['actions-wrapper']}>
                        <button
                            className={styles['saved-addresses__add-btn']}
                            onClick={onAddAddress}
                        >
                            <PlusIconHome size={16} /> Agregar dirección
                        </button>
                    </FilterUi.Actions>
                </FilterUi>
            </div>

            <div className={styles['saved-addresses__grid']}>
                <AnimatedListUi
                    items={filteredAddresses}
                    animationType="fade-up"
                    getItemId={(address) => address.uid || (address as any).id || Math.random().toString()}
                    renderItem={(address) => (
                        <AddressCard
                            address={address}
                            onEdit={handleEditAddress}
                            onDelete={handleDeleteAddress}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={address.isFavorite}
                        />
                    )}
                />
            </div>
        </div>
    );
};
