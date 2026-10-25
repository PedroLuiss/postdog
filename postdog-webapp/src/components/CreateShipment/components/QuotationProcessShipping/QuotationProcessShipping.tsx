import React from 'react';
import { TriangleAlert, Package } from 'lucide-react';
import styles from './ShipmentSummary.module.scss';

import CardStatusNoticeUi from '../../../ui/CardStatusNoticeUi/CardStatusNoticeUi';
import ButtonUi from '../../../ui/Button/ButtonUi';
import PackagingCardList from '../PackagingCardList/PackagingCardList';
import InsuranceCardPawSafe from '../InsuranceCardPawSafe/InsuranceCardPawSafe';
import PaymentDetailsCard from '../PaymentDetailsCard/PaymentDetailsCard';

import { useQuotationProcess } from './hooks/useQuotationProcess';

interface QuotationProcessShippingProps {
    onSuccess?: () => void;
}

export const QuotationProcessShipping: React.FC<QuotationProcessShippingProps> = ({ onSuccess }) => {
    const {
        state,
        isQuoted,
        isCreating,
        isIncompleteData,
        effectiveInsurancePrice,
        handleSelectPackaging,
        handleCreateShipment,
        handleQuoteAction,
        hasAutoQuoted,
        quotes,
        loadingQuotes
    } = useQuotationProcess(onSuccess);

    const showPackagingList = (isQuoted || loadingQuotes || (
        !hasAutoQuoted && 
        state.remitter.zipCode?.length === 5 && 
        state.addressee.zipCode?.length === 5
    )) && !isIncompleteData;

    const showQuoteButton = hasAutoQuoted && !isQuoted && !loadingQuotes && !isIncompleteData;

    return (
        <aside className={styles['summary-container']}>
            <div className={styles['summary-sticky']}>
                {!showPackagingList ? (
                    <div className={styles['summary-card']}>
                        {isIncompleteData ? (
                            <CardStatusNoticeUi
                                icon={<TriangleAlert size={32} />}
                                title="Datos incompletos"
                                description="Revisa los datos y vuelve a intentar."
                            />
                        ) : (
                            <CardStatusNoticeUi
                                icon={<Package size={32} />}
                                title="¿Estás listo para crear tu envío?"
                                description="Actualiza la información y vuelve a cotizar para ver las opciones disponibles."
                                actions={
                                    showQuoteButton ? (
                                        <ButtonUi
                                            variant="primary"
                                            onClick={handleQuoteAction}
                                            className={styles['summary-sticky__big-btn']}
                                            fullWidth
                                        >
                                            Cotizar
                                        </ButtonUi>
                                    ) : null
                                }
                            />
                        )}
                    </div>
                ) : (
                    <>
                        <div className={styles['summary-card']}>
                            <PackagingCardList
                                quotes={quotes}
                                loading={loadingQuotes}
                                onSelectPackaging={handleSelectPackaging}
                            />
                        </div>

                        {state.selectedPackaging && (
                            <>
                                <InsuranceCardPawSafe />

                                <PaymentDetailsCard
                                    shippingPrice={state.selectedPackaging.price}
                                    insurancePrice={effectiveInsurancePrice}
                                />

                                <ButtonUi
                                    variant="primary"
                                    className={styles['summary-sticky__big-btn']}
                                    fullWidth
                                    onClick={handleCreateShipment}
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creando envío...' : 'Crear envío'}
                                </ButtonUi>
                            </>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};