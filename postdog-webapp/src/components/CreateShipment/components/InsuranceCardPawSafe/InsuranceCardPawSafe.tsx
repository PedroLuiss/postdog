import React from 'react';
import { Shield, Check } from 'lucide-react';
import styles from './InsuranceCardPawSafe.module.scss';
import InputUi from '../../../ui/Input/InputUi';
import { useCreateShipmentContext } from '../../../../context/CreateShipmentContext';

export const InsuranceCardPawSafe: React.FC = () => {
    const { state, updateInsurance } = useCreateShipmentContext();
    const { insurance } = state;

    const handleToggle = () => {
        const nextActiveState = !insurance.active;
        
        if (nextActiveState) {
            updateInsurance({ 
                active: true, 
                declaredValue: '1000', 
                cost: 10 
            });
        } else {
            updateInsurance({ active: false });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newCost = Number(val) * 0.01; 
        updateInsurance({ declaredValue: val, cost: newCost });
    };

    return (
        <div className={styles['insurance-card']}>
            <div className={styles['insurance-card__container']}>
                
                <div className={styles['insurance-card__header']}>
                    <div className={styles['insurance-card__title-group']}>
                        <Shield size={24} />
                        <h3>Seguro PawSafe</h3>
                    </div>

                    <div 
                        className={`
                            ${styles['insurance-card__checkbox']} 
                            ${insurance.active ? styles['insurance-card__checkbox--checked'] : ''}
                        `}
                        onClick={handleToggle}
                    >
                        {insurance.active && <Check size={14} strokeWidth={4} />}
                    </div>
                </div>

                <p className={styles['insurance-card__description']}>
                    Protección en caso de robo, extravío, daño y mucho más
                </p>
                {insurance.active && (
                    <div className={styles['insurance-card__body']}>
                        <InputUi 
                            label="Valor declarado*"
                            type="number"
                            placeholder="1000"
                            value={insurance.declaredValue}
                            onChange={handleInputChange}
                            suffixIcon={<span style={{ fontSize: '12px', color: '#6b7280' }}>MXN</span>}
                        />

                        {Number(insurance.declaredValue) > 0 && (
                            <div className={styles['insurance-card__cost-box']}>
                                <div className={styles['insurance-card__cost-box-content']}>
                                    <span className={styles['insurance-card__cost-box-label']}>Costo del seguro:</span>
                                    <span className={styles['insurance-card__cost-box-value']}>
                                        ${insurance.cost.toFixed(2)} MXN
                                    </span>
                                </div>
                            </div>
                        )}

                        <p className={styles['insurance-card__footer-text']}>
                            Al agregar el seguro PawSafe, confirmo que he leído y acepto los 
                            <a href="#!"> términos y políticas</a>.

                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsuranceCardPawSafe;