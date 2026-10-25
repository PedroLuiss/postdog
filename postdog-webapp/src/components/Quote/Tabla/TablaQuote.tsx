import React, { useState, useEffect, useMemo } from 'react';
import styles from './TablaQuote.module.scss';
import { AlertIcon, ArrowDownIcon, ArrowUpIcon, FunnelIcon, SwapIcon } from '../../icons';
import PetsIcon from '@mui/icons-material/Pets';

import fallbackImage from '../../../assets/img/img-default.jpg'
import { CustomTooltip } from '../Tooltips/CustomTooltip';
import { FilterTooltip } from '../Tooltips/FilterTooltip';
import { ImageWithFallback, SkeletonLoader } from '../../ui';
import { Quote } from '../../../types';
import { MakeShipmentActions } from './actions/MakeShipmentActions';
import { EmptyStateUi } from '../../ui/EmptyStateUi/EmptyStateUi';
import { Calculator } from 'lucide-react';

interface TablaQuoteProps {
    quotesData: Quote[];
    loading?: boolean;
}

type SortKey = 'deliveryEstimateDays' | 'price';
type SortDirection = 'ascending' | 'descending';

export const TablaQuote: React.FC<TablaQuoteProps> = ({ quotesData, loading = false }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'price',
        direction: 'ascending',
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const availableCouriers = useMemo(() => Array.from(new Set(quotesData.map(q => q.courierName))), [quotesData]);
    const [selectedCouriers, setSelectedCouriers] = useState<string[]>(availableCouriers);

    const filteredAndSortedQuotes = useMemo(() => {
        let sortableItems = [...quotesData];

        if (selectedCouriers.length > 0 && selectedCouriers.length < availableCouriers.length) {
            sortableItems = sortableItems.filter(quote => selectedCouriers.includes(quote.courierName));
        }

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [quotesData, sortConfig, selectedCouriers, availableCouriers.length]);

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key) {
            return <span className={`${styles['quote-table__sort-icon']} ${styles['quote-table__sort-icon--inactive']}`}><SwapIcon /></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <span className={styles['quote-table__sort-icon']}><ArrowUpIcon /></span>;
        }
        return <span className={styles['quote-table__sort-icon']}><ArrowDownIcon /></span>;
    };

    if (loading) {
        return (
            <SkeletonLoader type='table' count={6} height={32} variant="text" spacing={2} />
        );
    }

    if (!quotesData || quotesData.length === 0) {
        return (
             <EmptyStateUi 
                icon={<Calculator />} 
                description="¡Guau! Las mejores opciones para tus envíos locales y nacionales. Cotiza cualquier paquete sin complicaciones."
            />
        );
    }


    return (
        <>
            <div className={styles['quote-table']}>
                <h3 className={styles['quote-table__title']}>
                    Encontramos {quotesData.length} {quotesData.length === 1 ? 'resultado' : 'resultados'} para tu búsqueda
                </h3>
                <div className={styles['quote-table__container']}>
                    <table>
                        <thead className={styles['quote-table__table-header']}>
                            <tr className={styles['quote-table__header-row']}>
                                <th className={styles['quote-table__header-cell']}>
                                    <div className={styles['quote-table__header-filter-wrapper']}>
                                        Paqueterías
                                        <span
                                            className={styles['quote-table__filter-icon']}
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        >
                                            <FunnelIcon />
                                        </span>
                                        {isFilterOpen && (
                                            <FilterTooltip
                                                onClose={() => setIsFilterOpen(false)}
                                                couriers={availableCouriers}
                                                selectedCouriers={selectedCouriers}
                                                onSelectionChange={setSelectedCouriers}
                                            />
                                        )}
                                    </div>
                                </th>
                                <th className={styles['quote-table__header-cell']}>Servicio</th>
                                <th className={styles['quote-table__header-cell']}>
                                    Recolección
                                    <CustomTooltip content={<>
                                        <p className='mb-0'>Déjalo en sucursal o pide que pase el cartero en Recolecciones</p></>} placement="bottom">
                                        <span ><AlertIcon /></span>
                                    </CustomTooltip>
                                </th>
                                <th className={`${styles['quote-table__header-cell']} ${styles['quote-table__header-cell--sortable']}`} onClick={() => requestSort('deliveryEstimateDays')}>
                                    Entrega estimada {getSortIcon('deliveryEstimateDays')}
                                </th>
                                <th className={`${styles['quote-table__header-cell']} ${styles['quote-table__header-cell--sortable']}`} onClick={() => requestSort('price')}>
                                    Precio estimado {getSortIcon('price')}
                                </th>
                                <th className={styles['quote-table__header-cell']}></th>
                            </tr>
                        </thead>
                        <tbody className={styles['quote-table__container__table-body']}>
                            {filteredAndSortedQuotes.map((quote) => (
                                <tr key={quote.id} className={styles['quote-table__body-row']}>
                                    <td className={styles['quote-table__cell']}>
                                        <div className={styles['quote-table__courier-info']}>
                                            <ImageWithFallback
                                                src={quote.courierLogo}
                                                fallbackSrc={fallbackImage}
                                                alt={quote.courierName}
                                                className={styles['quote-table__logo']}
                                            />
                                            {/* {quote.selected && <span className={styles['quote-table__selected-icon']}> icono </span>} */}
                                        </div>
                                    </td>
                                    <td className={styles['quote-table__cell']}>{quote.service}</td>
                                    <td className={styles['quote-table__cell']}>
                                        <span className={quote.pickup === 'No disponible' ? styles['quote-table__text--unavailable'] : ''}>
                                            {quote.pickup}
                                        </span>
                                    </td>
                                    <td className={styles['quote-table__cell']}>
                                        {quote.deliveryEstimateDays} {quote.deliveryEstimateDays > 1 ? 'días' : 'día'}
                                    </td>
                                    <td className={styles['quote-table__cell']}>
                                        ${quote.price.toFixed(2)} MXN
                                    </td>
                                    <td className={`${styles['quote-table__cell']} ${styles['quote-table__cell--action']}`}>
                                         <MakeShipmentActions quote={quote} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </>
    );
};