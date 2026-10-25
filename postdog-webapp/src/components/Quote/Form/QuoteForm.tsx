import React from 'react';
import styles from './QuoteForm.module.scss';
import { QuoteFormData } from '../../../types';
import {
    MapPin,
    ArrowRight,
    Ruler,
    Weight,
    Eraser,
    Package
} from 'lucide-react';
import ButtonUi from '../../ui/Button/ButtonUi';
import InputUi from '../../ui/Input/InputUi';
import SelectUi from '../../ui/SelectUi/SelectUi';
import { useQuoteFormComponent } from './hooks/useQuoteFormComponent';
import { CreateShipmentDrawer } from '../../CreateShipment/CreateShipmentDrawer';
import { QuoteFormSummary } from './QuoteFormSummary';
import AddressSelectUi from '../../ui/AddressSelectUi/AddressSelectUi';
import { SATProductSelect } from '../../ui/SATProductSelect/SATProductSelect';

interface QuoteFormProps {
    initialData?: Partial<QuoteFormData>;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ initialData }) => {
   const {
        formData,
        errors,
        handleChange,
        updateField,
        handleFormSubmit,
        resetForm,
        massWeight,
        volumetricWeight,
        quotedWeight,
        packageOptions,
        isLoadingPackages,
        handleSavedPackageChange, 
        handleOriginSelect,
        handleDestinationSelect,
        originAddresses,
        destinationAddresses,
        isFormComplete,
        state,
        updatePackage
    } = useQuoteFormComponent({ initialData });

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldsToResetPackage = ['length', 'width', 'height', 'weight'];
        const { name, value } = e.target;

        if (fieldsToResetPackage.includes(name)) {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            updateField('savedPackageId', '');
            
            if (state.packages.length > 0) {
                updatePackage(state.packages[0].id, {
                    savedPackageId: '',
                    [name]: sanitizedValue
                });
            }
            updateField(name as any, sanitizedValue);
            return;
        }
        handleChange(e);
    };

    return (

        <div className={styles['quote-form-card']}>

            <CreateShipmentDrawer initialQuoteData={formData} />

            <h2 className={styles['quote-form-card__title']}>
                Ingresa el destino y rastreamos el mejor precio
            </h2>

            <form onSubmit={handleFormSubmit} className={styles['quote-form-card__form']} noValidate>

                <div className={styles['quote-form-card__grid']}>
                    <AddressSelectUi
                        label="Origen"
                        name="originPostalCode"
                        placeholder="Código postal"
                        value={formData.originPostalCode}
                        onChange={handleChange}
                        onSelectAddress={handleOriginSelect}
                        savedAddresses={originAddresses}
                        savedAddressId={state.remitter.savedAddressId}
                        selectedAlias={state.remitter.alias}
                        icon={<MapPin size={20} />}
                        error={errors.originPostalCode}
                    />

                    <AddressSelectUi
                        label="Destino"
                        name="destinationPostalCode"
                        placeholder="Código postal"
                        value={formData.destinationPostalCode}
                        onChange={handleChange}
                        onSelectAddress={handleDestinationSelect}
                        savedAddresses={destinationAddresses}
                        savedAddressId={state.addressee.savedAddressId}
                        selectedAlias={state.addressee.alias}
                        icon={<ArrowRight size={20} />}
                        error={errors.destinationPostalCode}
                    />

                    <div className={`${styles['quote-form-card__grid--full-row']}`}>
                            <SelectUi
                                label="Paquete guardado (opcional)"
                                icon={<Package size={20} />}
                                placeholder={isLoadingPackages ? "Cargando paquetes..." : "Seleccionar paquete guardado"}
                                options={packageOptions}
                                name="savedPackage"
                                value={formData.savedPackageId || ''} 
                                onChange={handleSavedPackageChange}
                                disabled={isLoadingPackages} 
                            />
                    </div>
                </div>


                <div className={styles['quote-form-card__grid']}>
                    <div className={styles['quote-form-card__field']}>
                        <label className={styles['quote-form-card__label']}>Dimensiones del paquete</label>
                        <div className={styles['quote-form-card__input-container']}>
                            <Ruler className={styles['quote-form-card__icon']} size={20} />
                            <div className={styles['quote-form-card__dimensions']}>
                                <InputUi
                                    type="number"
                                    isInteger
                                    name="length"
                                    placeholder="Largo"
                                    value={formData.length}
                                    onChange={handleCustomChange}
                                    className={`${styles['quote-form-card__input']} ${errors.length ? styles['quote-form-card__input--error'] : ''}`}
                                    suffixIcon={<span className={styles['quote-form-card__suffix-icon']}>cm</span>}
                                />
                                <InputUi
                                    type="number"
                                    isInteger
                                    name="width"
                                    placeholder="Ancho"
                                    value={formData.width}
                                    onChange={handleCustomChange}
                                    className={`${styles['quote-form-card__input']} ${errors.width ? styles['quote-form-card__input--error'] : ''}`}
                                    suffixIcon={<span className={styles['quote-form-card__suffix-icon']}>cm</span>}
                                />
                                <InputUi
                                    type="number"
                                    isInteger
                                    name="height"
                                    placeholder="Alto"
                                    value={formData.height}
                                    onChange={handleCustomChange}
                                    className={`${styles['quote-form-card__input']} ${errors.height ? styles['quote-form-card__input--error'] : ''}`}
                                    suffixIcon={<span className={styles['quote-form-card__suffix-icon']}>cm</span>}
                                />
                            </div>

                        </div>
                    </div>

                    <div className={styles['quote-form-card__field']}>
                        <InputUi
                            label="Peso"
                            icon={<Weight size={20} />}
                            type="number"
                            isInteger
                            name="weight"
                            placeholder="Peso"
                            value={formData.weight}
                            onChange={handleCustomChange}
                            error={errors.weight}
                            showMessageError={false}
                            className={`${styles['quote-form-card__input']} ${errors.weight ? styles['quote-form-card__input--error'] : ''}`}
                            suffixIcon={<span className={styles['quote-form-card__suffix-icon']}>kg</span>}
                        />
                    </div>
                </div>

                <div className={styles['quote-form-card__grid--full-row'] }>
                    <SATProductSelect
                        label="Tipo de producto"
                        className={styles['quote-form-card__sat-select']}
                        placeholder="Busca por palabra clave o número de producto"
                        required
                        isInfo={false}
                        value={formData.productTypeCode && formData.productTypeDescription
                            ? `${formData.productTypeCode} - ${formData.productTypeDescription}`
                            : formData.productTypeCode || ''
                        }
                        onSelect={(opt) => {
                            updateField('productTypeCode', opt.code);
                            updateField('productTypeDescription', opt.description);                            
                            if (formData.savedPackageId) {
                                updateField('savedPackageId', ''); 
                            }

                            if (state.packages.length > 0) {
                                updatePackage(state.packages[0].id, {
                                    productTypeCode: opt.code,
                                    productTypeDescription: opt.description,
                                    savedPackageId: ''
                                });
                            }
                        }}
                        error={errors.productTypeCode}
                        showMessageError={true}
                    />
                </div>

                <div className={styles['quote-form-card__footer']}>

                    <QuoteFormSummary
                        massWeight={massWeight}
                        volumetricWeight={volumetricWeight}
                        quotedWeight={quotedWeight}
                    />

                    <div className={styles['quote-form-card__actions']}>
                        <ButtonUi
                            type="button"
                            variant="light"
                            onClick={resetForm}
                            icon={<Eraser size={16} />}
                        >
                            Limpiar campos
                        </ButtonUi>

                        <ButtonUi
                            type="submit"
                            variant="primary"
                            disabled={!isFormComplete}
                        >
                            Cotizar
                        </ButtonUi>
                    </div>
                </div>
            </form>
        </div>
    );
};