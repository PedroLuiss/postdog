import React from 'react';
import styles from './QuoteForm.module.scss';
import { Info } from 'lucide-react';
import { CustomTooltipUi } from '../../ui/CustomTooltipUi';

interface QuoteFormSummaryProps {
    massWeight: number | string;
    volumetricWeight: number | string;
    quotedWeight: number | string;
}

export const QuoteFormSummary: React.FC<QuoteFormSummaryProps> = ({ 
    massWeight, 
    volumetricWeight, 
    quotedWeight 
}) => {
    const mW = Number(massWeight) || 0;
    const vW = Number(volumetricWeight) || 0;
    const qW = Number(quotedWeight) || 0;

    return (
        <div className={styles['quote-form-card__summary']}>
            <div className={styles['quote-form-card__summary-item']}>
                <div className={styles['quote-form-card__summary-label-wrapper']}>
                    <span className={styles['quote-form-card__summary-label']}>Peso declarado</span>
                    <CustomTooltipUi 
                        variant="red" 
                        title="Si el peso del paquete no es correcto, la paquetería aplicará sobrepesos."
                    >
                        <Info size={12} className={styles['quote-form-card__icon']} />
                    </CustomTooltipUi>
                </div>
                <span className={styles['quote-form-card__summary-value']}>{mW.toFixed(2)} kg</span>
            </div>
            
            <div className={styles['quote-form-card__summary-item']}>
                <div className={styles['quote-form-card__summary-label-wrapper']}>
                    <span className={styles['quote-form-card__summary-label']}>Peso volumétrico</span>
                    <CustomTooltipUi 
                        variant="red" 
                        title="El precio del envío lo define la paquetería considerando el peso mayor entre dos opciones: el peso físico del paquete o el peso volumétrico, el cual se obtiene con esta fórmula: (largo × ancho × alto) ÷ 5000."
                    >
                        <Info size={12} className={styles['quote-form-card__icon']} />
                    </CustomTooltipUi>
                </div>
                <span className={styles['quote-form-card__summary-value']}>{vW.toFixed(2)} kg</span>
            </div>

            <div className={styles['quote-form-card__summary-item']}>
                <div className={styles['quote-form-card__summary-label-wrapper']}>
                    <span className={styles['quote-form-card__summary-label']}>Peso a cotizar</span>
                    <CustomTooltipUi 
                        variant="red" 
                        title="Se cotiza el peso mayor entre el peso masa y el peso volumétrico."
                    >
                        <Info size={12} className={styles['quote-form-card__icon']} />
                    </CustomTooltipUi>
                </div>
                <span className={styles['quote-form-card__summary-value']}>{Math.ceil(qW)} kg</span>
            </div>
        </div>
    );
};
