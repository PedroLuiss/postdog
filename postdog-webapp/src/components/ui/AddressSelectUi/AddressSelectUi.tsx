import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './AddressSelectUi.module.scss';
import InputUi from '../Input/InputUi';
import { AddressSelectUiProps } from './types/addressSelectUis.type';
import { useAddressSelectUi } from './hooks/useAddressSelectUi';
import { AddressItemSkeleton } from '../SkeletonUi/AddressItemSkeleton/AddressItemSkeleton';

const AddressSelectUi: React.FC<AddressSelectUiProps> = ({
    label,
    placeholder,
    value,
    onChange,
    onSelectAddress,
    savedAddresses,
    icon,
    name,
    error,
    savedAddressId,
    selectedAlias
}) => {
    const {
        isOpen,
        isFocused,
        containerRef,
        displayValue,
        zipData,
        isLoadingZipData,
        zipError,
        filteredAddresses,
        handleInternalChange,
        handleSelect,
        handleFocus,
        handleBlur
    } = useAddressSelectUi({ value, savedAddresses, savedAddressId, selectedAlias, onChange, onSelectAddress });

    const menuContent = () => {
        if (isLoadingZipData) {
            return <>
                    <div className={styles['address-menu__header']}>Buscando colonias...</div>
                    <div className={styles['address-menu__list']}>
                        {[...Array(3)].map((_, i) => (
                            <AddressItemSkeleton key={i} />
                        ))}
                    </div>
                </>;
        }

        if (zipData.length > 0) {
            return (
                <>
                    <div className={styles['address-menu__header']}>Colonias encontradas</div>
                    <div className={styles['address-menu__list']}>
                        {zipData.map((data, index) => (
                            <div
                                key={`${data.zipCode}-${index}`}
                                className={styles['address-item']}
                                onClick={() => handleSelect({
                                    id: `zip-${data.zipCode}-${data.colony}`,
                                    postalCode: data.zipCode,
                                    colony: data.colony,
                                    city: data.city,
                                    state: data.state,
                                    country: data.country,
                                    alias: data.colony,
                                    addressLine: '',
                                    tag: 'Origen' 
                                })}
                            >
                                <div className={styles['address-item__first-line']}>
                                    <span className={styles['address-item__alias']}>{data.colony}</span>
                                </div>
                                <div className={styles['address-item__details']}>
                                    {data.city}, {data.state}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }else if (zipError) {
            return <div className={styles['address-menu__header']}>{zipError}</div>;
        }

        if (filteredAddresses.length > 0) {
            return (
                <>
                    <div className={styles['address-menu__header']}>Direcciones guardadas</div>
                    <div className={styles['address-menu__list']}>
                        {filteredAddresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`${styles['address-item']} ${savedAddressId === addr.id ? styles['address-item--selected'] : ''}`}
                                onClick={() => handleSelect(addr)}
                            >
                                <div className={styles['address-item__first-line']}>
                                    <span className={styles['address-item__alias']}>{addr.alias}</span>
                                    <span className={styles['address-item__badge']}>{addr.tag}</span>
                                </div>
                                <div className={styles['address-item__details']}>
                                    {addr.addressLine}, {addr.colony}, {addr.city} - CP: {addr.postalCode}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <div className={styles['address-select']} ref={containerRef}>
            <InputUi
                label={label}
                name={name}
                placeholder={placeholder}
                value={displayValue}
                onChange={handleInternalChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={error || zipError}
                icon={icon}
                showMessageError={false}
                prefix={<span className={styles['address-select__mx-prefix']}>MX</span>}
                suffixIcon={
                    <ChevronDown
                        size={18}
                        className={`${styles['address-select__chevron']} ${isOpen ? styles['address-select__chevron--open'] : ''}`}
                    />
                }
                autoComplete="off"
                maxLength={isFocused ? 5 : undefined}
                inputMode="numeric"
            />

            {isOpen && (
                <div className={styles['address-menu']}>
                    {menuContent()}
                </div>
            )}
        </div>
    );
};

export default AddressSelectUi;