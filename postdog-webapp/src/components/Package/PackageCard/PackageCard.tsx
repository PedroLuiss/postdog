import React, { useState } from 'react';
import { Box, Ruler, Weight, Package, Heart, SquarePen, Trash2 } from 'lucide-react';
import styles from './PackageCard.module.scss';

import { CustomTooltipUi } from '../../ui/CustomTooltipUi'; 
import { AlertDialogUi } from '../../ui/AlertDialogUi/AlertDialogUi';
import { PackageResponse } from '../../../types';

interface PackageCardProps {
  data: PackageResponse;
  onEdit?: (data: PackageResponse) => void;
  onDelete?: (uid: string) => void;
  onToggleFavorite?: (uid: string) => void; 
}

export const PackageCard: React.FC<PackageCardProps> = ({ data, onEdit, onDelete, onToggleFavorite }) => {
  const isFavorite = data.isFavorite || false;
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete?.(data.uid);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className={styles['package-card']}>
      <div className={styles['package-card__container']}>
        <div className={styles['package-card__layout']}>
          
          <div className={styles['package-card__content']}>
            <div className={styles['package-card__header']}>
              <Box className={styles['package-card__icon-main']} />
              <h3 className={styles['package-card__title']}>{data.alias}</h3>
            </div>
            
            <div className={styles['package-card__details']}>
              <div className={styles['package-card__detail-row']}>
                <Ruler className={styles['package-card__icon-detail']} />
                <span>{`${Math.round(Number(data.lengthCm))} × ${Math.round(Number(data.widthCm))} × ${Math.round(Number(data.heightCm))} cm`}</span>
                <span className={styles['package-card__separator']}>·</span>
                <Weight className={styles['package-card__icon-detail']} />
                <span>{Math.round(Number(data.weightKg))} kg</span>
              </div>
              
              <div className={styles['package-card__detail-row']}>
                <Package className={`${styles['package-card__icon-detail']} ${styles['package-card__icon-detail--margin']}`} />
                <span>{data.productType}</span>
              </div>
            </div>
          </div>

          <div className={styles['package-card__actions']}>
            
            <CustomTooltipUi title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                 <button 
                    className={`
                      ${styles['package-card__button']} 
                      ${isFavorite ? styles['package-card__button--favorite-active'] : ''}
                    `} 
                    onClick={() => onToggleFavorite?.(data.uid)}
                  >
                    <Heart fill={isFavorite ? 'currentColor' : 'none'} size={18} />
                  </button>
            </CustomTooltipUi>

            <CustomTooltipUi title="Editar paquete">
                <button 
                  className={styles['package-card__button']} 
                  onClick={() => onEdit?.(data)}
                >
                  <SquarePen size={18} />
                </button>
            </CustomTooltipUi>

            <CustomTooltipUi title="Eliminar paquete">
                <button 
                  className={`${styles['package-card__button']} ${styles['package-card__button--delete']}`} 
                  onClick={() => setIsDeleteDialogOpen(true)} 
                >
                  <Trash2 size={18} />
                </button>
            </CustomTooltipUi>

          </div>

        </div>
      </div>

      <AlertDialogUi 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar paquete"
        description="¿Estás seguro de que deseas eliminar este paquete? Esta acción no se puede deshacer."
        confirmLabel="Confirmar"
      />
    </div>
  );
};