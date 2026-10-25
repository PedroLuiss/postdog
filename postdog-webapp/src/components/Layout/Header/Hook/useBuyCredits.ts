import { useState, useCallback, useEffect } from 'react';

export const useBuyCredits = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        const handleOpen = () => setIsModalOpen(true);
        window.addEventListener('open-wallet-modal', handleOpen);
        return () => window.removeEventListener('open-wallet-modal', handleOpen);
    }, []);

    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev);
    }, []);

    return {
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
    };
};

export default useBuyCredits;
