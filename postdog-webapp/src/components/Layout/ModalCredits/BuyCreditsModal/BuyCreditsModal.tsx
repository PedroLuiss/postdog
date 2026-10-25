import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ModalUi from '../../../ui/ModalUi/ModalUi';
import styles from './BuyCreditsModal.module.scss';

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <ModalUi
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={styles['modal-header']}>
                <h2 className={styles['modal-title']}>Comprar créditos</h2>
            </div>

            <div className={styles['modal-body']}>
                <div className={styles['icon-container']}>
                    <ShieldCheck size={40} />
                </div>

                <div className={styles['content-wrapper']}>
                    <h3 className={styles['main-text']}>Necesitas verificar tu cuenta</h3>
                    <p className={styles['sub-text']}>
                        Para poder realizar recargas, comunícate con nosotros para iniciar el procedimiento de verificación.
                    </p>
                </div>

                <button 
                  className={styles['btn-action']} 
                  onClick={() => window.open('https://api.whatsapp.com/send/?phone=1234567890&text=Hola%2C+necesito+verificar+mi+cuenta&type=phone_number&app_absent=0', '_blank')}
                >
                    Activar cuenta
                </button>
            </div>
        </ModalUi>
    );
};

export default BuyCreditsModal;
