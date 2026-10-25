import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Box } from '@mui/material';
import styles from './ShippingQuoteDrawer.module.scss';

import { StepOne } from './Steps/One/StepOne';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { StepTwo } from './Steps/Two/StepTwo';
import { StepThree } from './Steps/Three/StepThree';
import { useShippingQuoteDrawer } from '../../context';
import { CloseIcon } from '../icons';
import { useStepOne } from '../../hooks/useStepOne';
import { useStepTwo } from '../../hooks/useStepTwo';
import { useStepThree } from '../../hooks/useStepThree';
import { getFromStorage, removeFromStorage, saveToStorage } from '../../utils/storage.utils';
import { useShippingQuoteCreation } from '../../hooks/useShippingQuoteCreation';

const CURRENT_STEP_STORAGE_KEY = 'shippingQuoteDrawerCurrentStep';
const DRAWER_OPEN_STORAGE_KEY = 'shippingQuoteDrawerIsOpen';

export const ShippingQuoteDrawer: React.FC = () => {



    const { isOpen, closeDrawer, openDrawer, setLongingBtnSend } = useShippingQuoteDrawer();
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = getFromStorage(CURRENT_STEP_STORAGE_KEY);
        return savedStep ? Number(savedStep) : 1;
    });
    const isInitialMount = useRef(true);
    const totalSteps = 3;

    const [animationClass, setAnimationClass] = useState('');

    const {
        remitterData,
        addresseeData,
        remitterErrors,
        addresseeErrors,
        remitterColonies,
        addresseeColonies,
        isLoadingRemitterZip,
        isLoadingAddresseeZip,
        handleInputChange,
        validateFormStepOne,
        setRemitterErrors,
        setAddresseeErrors,
        clearForm,
        handleAddressSelect
    } = useStepOne();

    const stepTwoLogic = useStepTwo();
    const stepThreeLogic = useStepThree();
    const { isCreating, createQuote } = useShippingQuoteCreation();


    useEffect(() => {
        const wasDrawerOpen = getFromStorage(DRAWER_OPEN_STORAGE_KEY);
        if (wasDrawerOpen === 'true') {
            openDrawer();
        }
    }, [openDrawer]);

    useEffect(() => {
        saveToStorage(CURRENT_STEP_STORAGE_KEY, currentStep.toString());
    }, [currentStep]);

    useEffect(() => {
        saveToStorage(DRAWER_OPEN_STORAGE_KEY, isOpen.toString());
    }, [isOpen]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            const savedStep = getFromStorage(CURRENT_STEP_STORAGE_KEY);
            if (savedStep && Number(savedStep) === 3) {
                setCurrentStep(2);
            }
        }
    }, []);


    const changeStep = (nextStep: number) => {
        if (nextStep === currentStep || animationClass === styles['fade-out']) return;

        setAnimationClass(styles['fade-out']);

        setTimeout(() => {
            setCurrentStep(nextStep);
            setAnimationClass('');
        }, 300);
    };

    const handleNextStep = async () => {
        switch (currentStep) {
            case 1: {
                const remitterValidationErrors = validateFormStepOne(remitterData);
                const addresseeValidationErrors = validateFormStepOne(addresseeData);

                setRemitterErrors(remitterValidationErrors);
                setAddresseeErrors(addresseeValidationErrors);

                const isValid =
                    Object.keys(remitterValidationErrors).length === 0 &&
                    Object.keys(addresseeValidationErrors).length === 0;

                if (isValid) {
                    saveToStorage('stepOneData', { remitterData, addresseeData });
                    changeStep(2);
                }
                return;
            }

            case 2: {
                const isStepTwoValid = stepTwoLogic.validateStep();

                if (isStepTwoValid) {
                    saveToStorage('stepTwoData', stepTwoLogic.packages);


                    stepThreeLogic.getQuotes(
                        {
                            currency: "MXN",
                            addresses: [
                                {
                                    addressLine: remitterData.addressLine,
                                    interiorNumber: remitterData.interiorNumber,
                                    colony: remitterData.colony,
                                    postalCode: remitterData.postalCode,
                                    city: remitterData.city,
                                    state: remitterData.state,
                                    country: remitterData.country,
                                    references: remitterData.references,
                                    fullName: remitterData.fullName,
                                    phone: remitterData.phone,
                                    email: remitterData.email,
                                    company: remitterData.company,
                                    rfc: remitterData.rfc,
                                    alias: remitterData.alias || 'example',
                                    type: 'origin'
                                },
                                {
                                    addressLine: addresseeData.addressLine,
                                    interiorNumber: addresseeData.interiorNumber,
                                    colony: addresseeData.colony,
                                    postalCode: addresseeData.postalCode,
                                    city: addresseeData.city,
                                    state: addresseeData.state,
                                    country: addresseeData.country,
                                    references: addresseeData.references,
                                    fullName: addresseeData.fullName,
                                    phone: addresseeData.phone,
                                    email: addresseeData.email,
                                    company: addresseeData.company,
                                    rfc: addresseeData.rfc,
                                    alias: addresseeData.alias || 'example',
                                    type: 'destination'
                                }
                            ],
                            packages: stepTwoLogic.packages.map(({ packageType, widthCm, lengthCm, weightKg, heightCm }) => ({
                                typePackage: packageType,
                                weight: weightKg,
                                length: lengthCm,
                                width: widthCm,
                                height: heightCm
                            }))
                        }
                    );
                    changeStep(3);
                }
                return;
            }

            case 3: {
                const isStepThreeValid = stepThreeLogic.validateStep();

                if (isStepThreeValid) {

                    try {
                        const success = await createQuote({
                            destinationAddress: {
                                addressLine: addresseeData.addressLine,
                                interiorNumber: addresseeData.interiorNumber,
                                colony: addresseeData.colony,
                                postalCode: addresseeData.postalCode,
                                city: addresseeData.city,
                                state: addresseeData.state,
                                country: addresseeData.country,
                                references: addresseeData.references,
                                fullName: addresseeData.fullName,
                                phone: addresseeData.phone,
                                email: addresseeData.email,
                                company: addresseeData.company,
                                rfc: addresseeData.rfc,
                                alias: addresseeData.alias || '',
                                type: 'destination'
                            },
                            originAddress: {
                                addressLine: remitterData.addressLine,
                                interiorNumber: remitterData.interiorNumber,
                                colony: remitterData.colony,
                                postalCode: remitterData.postalCode,
                                city: remitterData.city,
                                state: remitterData.state,
                                country: remitterData.country,
                                references: remitterData.references,
                                fullName: remitterData.fullName,
                                phone: remitterData.phone,
                                email: remitterData.email,
                                company: remitterData.company,
                                rfc: remitterData.rfc,
                                alias: remitterData.alias || '',
                                type: 'origin'
                            },
                            packages: stepTwoLogic.packages.map(({ id, saveToList, items, alias, ...restOfPackage }) => ({
                                ...restOfPackage,
                                alias: alias || 'Paquete',
                                items: items.map(({ id, ...restOfItem }) => restOfItem)
                            })),
                            selectedCarrierQuote: {
                                uid: stepThreeLogic.selectedOptionId || ''
                            },
                            currency: 'MXN',
                            safeShipping: stepThreeLogic.isPawSafeActive,
                            status: 'generated',
                            declaredValue: parseInt(stepThreeLogic.declaredValue) || 0,
                        });
                        setLongingBtnSend(false);
                        removeFromStorage(CURRENT_STEP_STORAGE_KEY);
                        removeFromStorage(DRAWER_OPEN_STORAGE_KEY);

                        removeFromStorage('stepOneData');
                        removeFromStorage('stepTwoData');
                        removeFromStorage('stepThreeData');
                        setCurrentStep(1);
                        console.log("Resultado de la creación de la cotización:", success);

                        // Close drawer and rely on automatic Wallet debiting programmed in backend
                        closeDrawer();
                        // Instead of full alert, we just close here, backend did auto wallet debit
                    } catch (error: any) {
                        setLongingBtnSend(false);
                        const status = error.response?.status;
                        const msg = error.response?.data?.message || error.message || "Error desconocido al crear la cotización.";
                        console.error("Fallo al crear la cotización. Mensaje de error:", error);

                        if (status === 402) {
                            alert("Saldo insuficiente: " + msg);
                            window.dispatchEvent(new CustomEvent('open-wallet-modal'));
                        } else {
                            alert(msg);
                        }
                    }
                }
                return;
            }

            default:
                console.warn('Paso no reconocido');
        }
    };


    const handlePreviousStep = () => {
        if (currentStep > 1) {
            changeStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StepOne
                    remitterData={remitterData}
                    addresseeData={addresseeData}
                    remitterErrors={remitterErrors}
                    addresseeErrors={addresseeErrors}
                    remitterColonies={remitterColonies}
                    addresseeColonies={addresseeColonies}
                    isLoadingRemitterZip={isLoadingRemitterZip}
                    isLoadingAddresseeZip={isLoadingAddresseeZip}
                    handleInputChange={handleInputChange}
                    handleClearForm={clearForm}
                    handleAddressSelect={handleAddressSelect}
                />;
            case 2:
                return <StepTwo {...stepTwoLogic} />;
            case 3:
                return <StepThree handleSend={handleNextStep} loadingParcel={stepThreeLogic.loading} {...stepThreeLogic} />;
            default:
                return <><h2>Error al seleccionar el paso</h2></>
        }
    };

    const handleClose = () => {
        removeFromStorage(DRAWER_OPEN_STORAGE_KEY);
        removeFromStorage(CURRENT_STEP_STORAGE_KEY);
        setCurrentStep(1);
        closeDrawer();
    };


    const handleSave = async () => {
        setLongingBtnSend(true);

        const originAddressData = {
            ...remitterData,
            type: 'origin',
            alias: remitterData.alias || '',
        };
        const destinationAddressData = {
            ...addresseeData,
            type: 'destination',
            alias: addresseeData.alias || '',
        };

        let packagesData = null;
        let selectedCarrierQuoteData = null;
        let safeShippingData = false;
        let declaredValueData = 0;

        if (currentStep >= 2 && stepTwoLogic.packages.length > 0) {
            packagesData = stepTwoLogic.packages.map(({ id, saveToList, items, alias, ...restOfPackage }) => ({
                ...restOfPackage,
                alias: alias || 'Paquete',
                items: items.map(({ id, ...restOfItem }) => restOfItem)
            }));
        }

        if (currentStep >= 3) {
            selectedCarrierQuoteData = stepThreeLogic.selectedOptionId ? { uid: stepThreeLogic.selectedOptionId } : null;
            safeShippingData = stepThreeLogic.isPawSafeActive;
            declaredValueData = parseInt(stepThreeLogic.declaredValue) || 0;
        }

        const payload = {
            originAddress: originAddressData,
            destinationAddress: destinationAddressData,
            packages: packagesData,
            selectedCarrierQuote: selectedCarrierQuoteData,
            currency: 'MXN',
            safeShipping: safeShippingData,
            declaredValue: declaredValueData,
            status: 'pending',
        };

        // const success = await createQuote(payload);
        console.log(payload);

        setLongingBtnSend(false);

        // if (success) {
        //     alert('Borrador guardado exitosamente.');
        //     // Usamos handleClose para limpiar el estado y cerrar el drawer
        //     handleClose();
        // } else {
        //     console.error("Fallo al guardar el borrador:", creationError);
        //     alert(creationError || "Error desconocido al guardar el borrador.");
        // }
    };

    return (
        <div>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={handleClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '100%',
                        maxWidth: '850px',
                        height: '100dvh',
                        boxSizing: 'border-box',

                    },
                }}
            >
                <Box className={styles['shipment-drawer']}>
                    <header className={styles['shipment-drawer__header']}>
                        <h2 className={styles['shipment-drawer__title']}>Datos del envío</h2>
                        <div className={styles['shipment-drawer__actions']}>
                            <button
                                onClick={handleSave}
                                disabled={isCreating}
                                className={styles['shipment-drawer__save-button']}
                            >
                                {isCreating ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button onClick={handleClose} className={styles['shipment-drawer__close-button']}><CloseIcon /></button>
                        </div>
                    </header>

                    <main className={styles['shipment-drawer__body']}>
                        <div className={`${styles['step-content']} ${animationClass}`}>
                            {renderStepContent()}
                        </div>
                    </main>

                    <footer className={styles['shipment-drawer__footer']}>
                        {currentStep > 1 ? (
                            <button onClick={handlePreviousStep} className={styles['shipment-drawer__back-button']}>
                                <KeyboardBackspaceIcon /> <span>Regresar</span>
                            </button>
                        ) : (
                            <span />
                        )}

                        <span className={styles['shipment-drawer__progress']}>
                            {currentStep} de {totalSteps}
                        </span>
                        {
                            currentStep < totalSteps && (
                                <button onClick={handleNextStep} disabled={isCreating} className={styles['shipment-drawer__submit-button']}>
                                    {currentStep < totalSteps ? 'Siguiente' : 'Enviar'}
                                </button>
                            )
                        }

                    </footer>
                </Box>

            </Drawer>
        </div>
    );
};