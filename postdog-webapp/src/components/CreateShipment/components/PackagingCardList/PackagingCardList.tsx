import React from 'react';
import { Package } from 'lucide-react';
import styles from './PackagingCardList.module.scss';
import PackagingItem from './PackagingItem';
import SelectedPackagingCard from './SelectedPackagingCard';
import { usePackagingCardList } from './hooks/usePackagingCardList';
import PackagingItemSkeleton from '../../../ui/SkeletonUi/PackagingCardList/PackagingItemSkeleton';
import { Quote, FormattedPackaging } from '../../../../types';

interface PackagingCardListProps {
    quotes: Quote[];
    loading: boolean;
    onSelectPackaging?: (packaging: FormattedPackaging) => void;
}

const PackagingCardList: React.FC<PackagingCardListProps> = ({
    quotes,
    loading,
    onSelectPackaging
}) => {
    const {
        selectedId,
        isCollapsed,
        packaging,
        selectedItem,
        handlePackagingClick,
        handleOpenList
    } = usePackagingCardList(quotes, onSelectPackaging);

    return (
        <div className={styles['packaging-list']}>
            <div className={styles['packaging-list__header']}>
                <div className={styles['packaging-list__title-group']}>
                    <Package size={24} className={styles['packaging-list__icon']} />
                    <h3 className={styles['packaging-list__title']}>Paquetería</h3>
                </div>
                <p className={styles['packaging-list__description']}>Elige la paquetería que mejor acompañe tu envío</p>
                <p className={styles['packaging-list__small-text']}>
                    <span className={styles['packaging-list__break-text']}>Puedes activar o desactivar paqueterías para hacer más rápida la </span>
                    <span>cotización desde la sección <a href="#!">Paqueterías</a>.</span>

                </p>
            </div>

            {isCollapsed && selectedItem ? (
                <SelectedPackagingCard
                    packaging={selectedItem}
                    onOpenList={handleOpenList}
                />
            ) : (
                <div className={styles['packaging-list__content']}>
                    <div className={styles['packaging-list__items-grid']}>
                        {packaging.map(p => (
                            <PackagingItem
                                key={p.id}
                                packaging={p}
                                isSelected={selectedId === p.id}
                                onSelect={() => handlePackagingClick(p)}
                            />
                        ))}

                        {loading && (
                            <>
                                <PackagingItemSkeleton />
                                <PackagingItemSkeleton />
                            </>
                        )}

                        {!loading && packaging.length === 0 && (
                            <div className={styles['no-results']}>
                                No se encontraron opciones de envío.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackagingCardList;