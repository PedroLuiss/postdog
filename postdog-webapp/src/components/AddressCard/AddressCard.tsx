import React from 'react';
import styles from './AddressCard.module.scss';
import {
    EditIcon,
    TrashIcon,
    MapPinIcon,
    BuildingIcon,
} from '../icons';
import {
    Heart,
    Bookmark,
    User,
    Phone,
    Mail,
    Hash
} from 'lucide-react';
import { DataSaveAddress } from '../../types';
import { useAddressCard } from './hooks/useAddressCard';
import { CustomTooltipUi } from '../ui/CustomTooltipUi';

interface AddressCardProps {
    address: DataSaveAddress;
    onEdit?: (address: DataSaveAddress) => void;
    onDelete?: (address: DataSaveAddress) => void;
    onToggleFavorite?: (address: DataSaveAddress) => void;
    isFavorite?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
    address,
    onEdit,
    onDelete,
    onToggleFavorite,
    isFavorite = false
}) => {
    const { cardRef, isVisible } = useAddressCard();

    return (
        <div
            ref={cardRef}
            className={`${styles['address-card']} ${isVisible ? styles['is-visible'] : ''}`}
        >
            <div className={styles['address-card__header']}>
                <div className={styles['address-card__alias-container']}>
                    <Bookmark size={20} className={styles['address-card__bookmark-icon']} />
                    <h3 className={styles['address-card__alias']}>{address.alias}</h3>
                </div>
                {address.type && (
                    <div className={styles['address-card__label-badge']}>
                        {address.type === 'origin' ? 'Origen' : (address.type === 'destination' ? 'Destino' : 'Ambas')}
                    </div>
                )}
            </div>

            <div className={styles['address-card__content']}>
                <div className={styles['address-card__main-info']}>
                    <div className={styles['address-card__detail-item']}>
                        <MapPinIcon size={16} className={styles['address-card__icon']} />
                        <div className={styles['address-card__address-text']}>
                            <p>{address.addressLine}{address.interiorNumber ? ` | Int. ${address.interiorNumber}` : ''}</p>
                            <p>{address.colony}, {address.city}, {address.state}, México</p>
                            <p>{address.postalCode} {address.references ? `| ${address.references}` : ''}</p>
                        </div>
                    </div>
                </div>

                <div className={styles['address-card__contact-info']}>
                    <div className={styles['address-card__detail-item']}>
                        <User size={16} className={styles['address-card__icon']} />
                        <span>{address.fullName}</span>
                    </div>
                    <div className={styles['address-card__detail-item']}>
                        <Phone size={16} className={styles['address-card__icon']} />
                        <span>{address.phone}</span>
                    </div>
                    <div className={styles['address-card__detail-item']}>
                        <Mail size={16} className={styles['address-card__icon']} />
                        <span>{address.email}</span>
                    </div>
                </div>

                {(address.company || address.rfc) && (
                    <div className={styles['address-card__company-info']}>
                        {address.company && (
                            <div className={styles['address-card__detail-item']}>
                                <BuildingIcon width={16} height={16} className={styles['address-card__icon']} />
                                <span>{address.company}</span>
                            </div>
                        )}
                        {address.rfc && (
                            <div className={styles['address-card__detail-item']}>
                                <Hash size={16} className={styles['address-card__icon']} />
                                <span>{address.rfc}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles['address-card__actions']}>
                {address.type !== 'destination' && (
                    <CustomTooltipUi title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                        <button
                            className={`${styles['address-card__action-btn']} ${isFavorite ? styles['address-card__action-btn--favorite'] : ''}`}
                            onClick={() => onToggleFavorite?.(address)}
                        >
                            <Heart
                                size={16}
                                className={isFavorite ? styles['address-card__heart--active'] : ''}
                            />
                        </button>
                    </CustomTooltipUi>
                )}
                <button className={styles['address-card__action-btn']} onClick={() => onEdit?.(address)}>
                    <EditIcon width={16} height={16} />
                </button>
                <button className={styles['address-card__action-btn']} onClick={() => onDelete?.(address)}>
                    <TrashIcon width={16} height={16} />
                </button>
            </div>
        </div>
    );
};
