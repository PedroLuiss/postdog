import React from 'react';
import { Search } from 'lucide-react';
import { EmptyStateResultUi } from '../../ui/EmptyStateUi/EmptyStateResultUi/EmptyStateResultUi';

interface ShipmentEmptyStateProps {
    onClear: () => void;
}

const ShipmentEmptyState: React.FC<ShipmentEmptyStateProps> = ({ onClear }) => {
    return (
        <EmptyStateResultUi 
            title="No se encontraron envíos"
            description="No hay envíos que coincidan con los filtros o búsqueda aplicados. Intenta ajustar los criterios."
            icon={<Search />}
            actionLabel="Limpiar búsqueda"
            onAction={onClear}
        />
    );
};

export default ShipmentEmptyState;