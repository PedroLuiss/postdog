import styles from './PackagesPage.module.scss';
import { PackageCard } from '../../../components/Package/PackageCard';
import { PackageFilter } from '../../../components/Package/PackageFilter';
import { AddPackageDrawer } from '../../../components/Package/AddPackageModalDrawer/AddPackageModalDrawer';
import { PackageCardSkeleton } from '../../../components/ui/SkeletonUi/PackagesPage/PackageCardSkeleton';
import { usePackagesPage } from './hooks/usePackagesPage';
import { Box, PawPrint, Search } from 'lucide-react';
import { EmptyStateResultUi } from '../../../components/ui/EmptyStateUi/EmptyStateResultUi/EmptyStateResultUi';
import { EmptyNoResult } from '../../../components/ui/EmptyStateUi/EmptyNoResult/EmptyNoResult';

import { AnimatedListUi } from '../../../components/ui/AnimatedListUi/AnimatedListUi';

export const PackagesPage = () => {
    const {
        packages,
        loading,
        isFetchingMore,
        error,
        observerTarget,
        isDrawerOpen,
        selectedPackage,
        handleOpenAddModal,
        handleOpenEditModal,
        handleCloseDrawer,
        handleSearch,
        handleDelete,
        searchTerm,
        setSearchTerm,
        handleToggleFavorite
    } = usePackagesPage();

    const shouldShowFilter = packages.length > 0 || searchTerm.trim() !== '';

    return (
        <div className={styles['main-container']}>

            {shouldShowFilter && (
                <PackageFilter
                    onSearch={handleSearch}
                    onAddClick={handleOpenAddModal}
                />
            )}

            <div className={styles['package-grid']}>
                {error && <div className={styles['error-message']}>{error}</div>}

                {packages.length === 0 && !loading ? (
                    searchTerm.trim() !== '' ? (
                        <EmptyStateResultUi
                            title="No se encontraron coincidencias"
                            description={`No encontramos ningún paquete que coincida con "${searchTerm}". Intenta con otro nombre.`}
                            icon={<Search />}
                            actionLabel="Limpiar búsqueda"
                            onAction={() => setSearchTerm('')}
                        />
                    ) : (
                        <EmptyNoResult
                            title="Tus paquetes de siempre"
                            description="Guárdalos una vez y reutilízalos cada vez que envíes."
                            mainIcon={<Box />}
                            badgeIcon={<PawPrint />}
                            actionLabel="Agregar paquete"
                            onAction={handleOpenAddModal}
                        />
                    )
                ) : (
                    <>
                        <AnimatedListUi
                            items={packages}
                            getItemId={(pkg) => pkg.uid}
                            renderItem={(pkg) => (
                                <PackageCard
                                    data={pkg}
                                    onEdit={() => handleOpenEditModal(pkg)}
                                    onDelete={handleDelete}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            )}
                        />

                        <div ref={observerTarget} className={styles['package-grid__infinite-scroll']}>
                            {isFetchingMore && (
                                <AnimatedListUi
                                    items={[1, 2]}
                                    getItemId={(i) => `infinite-skeleton-${i}`}
                                    renderItem={() => <PackageCardSkeleton />}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            <AddPackageDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                packageData={selectedPackage || undefined}
            />
        </div>
    );
};