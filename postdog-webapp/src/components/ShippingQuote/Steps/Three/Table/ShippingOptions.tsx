import React from 'react';
import styles from './ShippingOptions.module.scss';
import { AlertIcon, ArrowDownIcon, ArrowUpIcon, FunnelIcon, SwapIcon } from '../../../../icons';
import { CustomTooltipUi } from '../../../../ui/CustomTooltipUi';
import { FilterTooltip } from '../../../../Quote/Tooltips/FilterTooltip';
import { ShippingOptionsProps } from '../../../../../types';
import { SkeletonLoader } from '../../../../ui';

export interface ShippingOptionsPropsWithLoading extends ShippingOptionsProps {
    loading?: boolean;
}

export const ShippingOptions: React.FC<ShippingOptionsPropsWithLoading> = ({
    options,
    selectedOptionId,
    onSelectOption,
    onSort,
    sortConfig,
    isFilterOpen,
    onFilterToggle,
    onFilterClose,
    availableCarriers,
    selectedCarriers,
    onFilterChange,
    loading = false,
}) => {

    const getSortIndicator = (key: 'estimatedDelivery' | 'price') => {
        if (sortConfig.key !== key) {
            return <SwapIcon />;
        }
        if (sortConfig.direction === 'asc') {
            return <ArrowUpIcon />;
        }
        return <ArrowDownIcon />;
    };


    const renderTableBody = () => {
        if (!loading && options.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className={styles['shipping-options__no-results']}>
                        No se encontraron opciones de envío.
                    </td>
                </tr>
            );
        }

        const optionRows = options.map((option) => (
            <tr
                key={option.id}
                className={`${styles['shipping-option']} ${selectedOptionId === option.id ? styles['shipping-option--selected'] : ''}`}
                onClick={() => onSelectOption(option.id)}
            >
                <td><img src={option.logo} alt={`${option.carrier} logo`} /></td>
                <td>{option.service}</td>
                <td>{option.collection}</td>
                <td>{option.estimatedDelivery}</td>
                <td>${option.price.toFixed(2)} MXN</td>
            </tr>
        ));

        const loadingRow = loading ? (
            <tr key="loading-skeleton">
                <td colSpan={5} >
                    <SkeletonLoader type='table' count={0} width={'100%'} />
                </td>
            </tr>
        ) : null;

        return (
            <>
                {optionRows}
                {loadingRow}
            </>
        );

    };

    return (
        <div className={styles['shipping-options']}>
            <p className={styles['shipping-options__subtitle']}>
                Elige la paquetería que mejor acompañe tu envío
            </p>
            <table className={styles['shipping-options__table']}>
                <thead className='shipping-options__table__thead'>
                    <tr>
                        <th className={styles['shipping-options__table__filter-header']}>
                            <div className={styles['shipping-options__table__header-filter-wrapper']}>
                                Paqueterías
                                <span onClick={onFilterToggle} className={styles['shipping-options__table__filter-icon']}>
                                    <FunnelIcon />
                                </span>
                                {isFilterOpen && (
                                    <FilterTooltip
                                        onClose={onFilterClose}
                                        couriers={availableCarriers}
                                        selectedCouriers={selectedCarriers}
                                        onSelectionChange={onFilterChange}
                                    />
                                )}
                            </div>
                        </th>
                        <th>Servicio</th>
                        <th>Recolección <CustomTooltipUi title="Déjalo en sucursal o pide que pase el cartero en Recolecciones" placement="top">
                            <span className={styles['shipping-options__table__info-icon']}><AlertIcon /></span>
                        </CustomTooltipUi></th>
                        <th
                            className={styles['shipping-options__table__sortable-header']}
                            onClick={() => onSort('estimatedDelivery')}
                        >
                            Entrega estimada <span>{getSortIndicator('estimatedDelivery')}</span>
                        </th>
                        <th
                            className={styles['shipping-options__table__sortable-header']}
                            onClick={() => onSort('price')}
                        >
                            Precio estimado <span>{getSortIndicator('price')}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody()}
                </tbody>
            </table>

        </div>
    );
};