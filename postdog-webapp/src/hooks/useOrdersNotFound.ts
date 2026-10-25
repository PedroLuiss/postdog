import { OrdersNotFoundProps } from '../types/orders-not-found.type';

export const useOrdersNotFound = ({ onResetSearch }: OrdersNotFoundProps) => {
    const handleResetSearch = () => {
        if (onResetSearch) {
            onResetSearch();
        }
    };

    return {
        handleResetSearch,
    };
};
