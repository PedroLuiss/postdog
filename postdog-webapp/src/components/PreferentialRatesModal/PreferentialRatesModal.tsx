import React from 'react';
import { ModalUi } from '../ui/ModalUi/ModalUi';
import { usePreferentialRatesModal } from './Hook/usePreferentialRatesModal';
import { PreferentialRatesModalProps } from './Type/PreferentialRatesModal.Type';
import { PreferentialRatesHeader, PreferentialRatesGrid, PreferentialRatesNote, PreferentialRatesFooter } from './components';
import styles from './PreferentialRatesModal.module.scss';

export const PreferentialRatesModal: React.FC<PreferentialRatesModalProps> = ({
    isOpen,
    onClose
}) => {
    const { tiers, handleContactSales } = usePreferentialRatesModal(isOpen);

    return (
        <ModalUi
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="lg"
            className={styles['modal-principal']}
            closeButtonClassName={styles['btn-cerrar-icono']}
        >
            <PreferentialRatesHeader
                title="Tarifas Preferenciales"
                description="Accede a mejores tarifas según tu nivel de recarga y uso mensual"
            />
            <PreferentialRatesGrid tiers={tiers} />
            <PreferentialRatesNote
                text="Importante: Si no realizas envíos durante un mes, perderás tus tarifas preferenciales y tu cuenta regresará automáticamente a las tarifas base. Para volver a activar un nivel preferencial, deberás realizar nuevamente la recarga del nivel deseado."
            />
            <PreferentialRatesFooter
                onContactSales={handleContactSales}
            />
        </ModalUi>
    );
};

export default PreferentialRatesModal;
