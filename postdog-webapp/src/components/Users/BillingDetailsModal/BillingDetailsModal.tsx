import React from 'react';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';
import styles from './BillingDetailsModal.module.scss';
import { useBillingDetailsModal } from './hooks/useBillingDetailsModal';
import { BillingDetailsSkeleton } from '../../ui/SkeletonUi/BillingDetailsSkeleton';
import { ReadOnlyField } from './ReadOnlyField/ReadOnlyField';

export const BillingDetailsModal = ({ isOpen, onClose, user }: any) => {
    const { fiscalData, isLoading } = useBillingDetailsModal(user?.uid, isOpen);

    if (!user) return null;

    return (
        <DrawerModalUi
            isOpen={isOpen}
            onClose={onClose}
            title={`Datos de Facturación - ${user.firstName}`}
            maxWidthLg="30rem"
        >
            <div className={styles['billing-modal__content']}>
                {isLoading ? (
                    <BillingDetailsSkeleton />
                ) : !fiscalData ? (
                    <div className={styles['billing-modal__empty']}>
                        El usuario no ha registrado datos de facturación todavía.
                    </div>
                ) : (
                    <>
                        <ReadOnlyField
                            label="Tipo de Persona"
                            value={fiscalData.personType === 'PHYSICAL' ? 'Persona Física' : 'Persona Moral'}
                        />
                        <ReadOnlyField label="RFC" value={fiscalData.rfc} />
                        <ReadOnlyField label="Razón Social" value={fiscalData.businessName} />
                        <ReadOnlyField label="Código Postal" value={fiscalData.postalCode} />
                        <ReadOnlyField label="Régimen Fiscal" value={fiscalData.taxRegime} />
                        <ReadOnlyField label="Uso de CFDI" value={fiscalData.cfdiUse} />
                        <ReadOnlyField label="Método de Pago" value={fiscalData.paymentMethod} />
                        
                        <div className={styles['billing-modal__divider']} />
                        
                        <div className={styles['billing-modal__auto-invoice']}>
                            <p>Facturación Automática: <strong>{fiscalData.autoInvoiceEnabled ? 'Activada' : 'Desactivada'}</strong></p>
                            {fiscalData.autoInvoiceEnabled && (
                                <p>Tipo de facturación: <strong>{fiscalData.autoInvoiceType === 'MONTHLY' ? 'Mensual' : fiscalData.autoInvoiceType}</strong></p>
                            )}
                        </div>
                    </>
                )}
                
                <div className={styles['billing-modal__note']}>
                    Nota: Estos datos son de solo lectura y se sincronizan desde el perfil del usuario.
                </div>
            </div>
        </DrawerModalUi>
    );
};

