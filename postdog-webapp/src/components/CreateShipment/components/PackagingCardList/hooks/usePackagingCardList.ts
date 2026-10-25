import { useState, useEffect } from 'react';
import { Quote, FormattedPackaging } from '../../../../../types';

export const usePackagingCardList = (
    realQuotes: Quote[], 
    onSelectPackaging?: (packaging: FormattedPackaging) => void
) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const packaging = realQuotes.map<FormattedPackaging>(q => ({
        id: q.id,
        name: `${q.courierName} ${q.service}`,
        logo: q.courierLogo,
        estimate: `${q.deliveryEstimateDays} ${q.deliveryEstimateDays === 1 ? 'día' : 'días hábiles'}`,
        price: q.price,
        pickup: q.pickup === 'Disponible',
        pickupAvailable: q.pickupAvailable,
        trackingAvailable: q.trackingAvailable,
        thermalPrintingAvailable: q.thermalPrintingAvailable,
    }));

    const selectedItem = packaging.find(p => p.id === selectedId);

    const handlePackagingClick = (p: FormattedPackaging) => {
        setSelectedId(p.id);
        if (onSelectPackaging) onSelectPackaging(p);
        setIsCollapsed(true);
    };

    const handleOpenList = () => {
        setIsCollapsed(false);
    };

    useEffect(() => {
        if (realQuotes.length === 0) {
            setSelectedId(null);
            setIsCollapsed(false);
        }
    }, [realQuotes.length]);

    return {
        selectedId,
        isCollapsed,
        packaging,
        selectedItem,
        handlePackagingClick,
        handleOpenList
    };
};