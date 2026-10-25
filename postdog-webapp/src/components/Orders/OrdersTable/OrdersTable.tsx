import React, { useState, useEffect, useRef } from 'react';

// Styles
import styles from './OrdersTable.module.scss';

// Components
import { SkeletonLoader } from '../../ui';
import { ErrorMessage } from '../../ui/ErrorMessage/ErrorMessage';
import { OrderCard } from '../OrderCard/OrderCard';
import { DeleteOrderModal } from '../DeleteOrderModal/DeleteOrderModal';

// Types
import { OrdersTableProps, DataOrder } from '../../../types';

export const OrdersTable: React.FC<OrdersTableProps> = ({
  shipments,
  isLoading = false,
  error = null,
  onDelete,
  onEdit,
  onLoadMore,
  hasMore = false
}) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<DataOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const observerTarget = useRef(null);

  const handleDeleteClick = (order: DataOrder) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete && onDelete) {
      setIsDeleting(true);
      await onDelete(orderToDelete.uid);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (shipments.length === 0 && !isLoading && !error) {
    return (
      <div className={styles['table-list-orders']}>
        <p className={styles['table-list-orders__text-no-records']}>No se encontraron ordenes con los filtros seleccionados.</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  return (
    <div className={styles['orders-list-container']}>
      <div className={styles['orders-cards-wrapper']}>
        {shipments.map((shipment) => (
          <OrderCard
            key={shipment.uid}
            order={shipment}
            onDelete={handleDeleteClick}
            onShip={(order) => onEdit?.(order)}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={observerTarget}>
          <SkeletonLoader count={1} type="order-card" />
        </div>
      )}

      {isLoading && shipments.length === 0 && (
        <div className={styles['orders-cards-wrapper']}>
          <SkeletonLoader count={3} type="order-card" />
        </div>
      )}

      <DeleteOrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        orderNumber={orderToDelete?.orderNumber}
        isLoading={isDeleting}
      />
    </div>
  );
};
