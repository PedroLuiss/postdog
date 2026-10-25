import { useCallback } from 'react';

export const useNoMovementsRecorded = () => {
    const handleAddCredits = useCallback(() => {
        window.dispatchEvent(new Event('open-wallet-modal'));
    }, []);

    return {
        handleAddCredits,
    };
};
