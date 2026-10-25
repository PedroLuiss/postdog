import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateShipmentContext } from '../../../../../context/CreateShipmentContext';
import { useNotification } from '../../../../../context/NotificationContext';
import { useShippingQuoteCreation } from '../../../../../hooks/useShippingQuoteCreation';
import { useQuotes } from '../../../../../hooks/useQuotes';
import { AddressData, Package, PackageData } from '../../../../../types';
import { useWalletContext } from '../../../../../context/WalletContext';

export const useQuotationProcess = (onSuccess?: () => void) => {
    const navigate = useNavigate();
    const {
        state,
        selectPackaging,
        closeModalCreateShipment,
        setErrors,
        setIsRemitterEditing,
        setIsAddresseeEditing,
        setIsPackageEditing,
        isModalCreateShipmentOpen
    } = useCreateShipmentContext();
    const { refreshBalance } = useWalletContext();
    const { showNotification } = useNotification();
    const { createQuote, isCreating } = useShippingQuoteCreation();
    const { quotes, loading: loadingQuotes, getQuotes } = useQuotes();
    const [isQuoted, setIsQuoted] = useState(false);

    const cleanLettersOnly = (str: string) =>
        (str || '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').substring(0, 30).trim();

    const cleanPhone = (str: string) =>
        (str || '').replace(/\D/g, '').substring(0, 10);

    const truncate = (str: string | undefined, limit: number) =>
        (str || '').substring(0, limit).trim();

    const mapAddress = (data: AddressData, type: 'origin' | 'destination'): any => {
        const address: any = {
            type,
            addressLine: truncate(data.street, 25) || 'Calle desconocida',
            colony: data.colony === 'Otro' ? data.customColony : data.colony,
            postalCode: data.zipCode,
            city: data.city || 'Ciudad',
            state: data.state || 'Estado',
            country: data.country || 'MX',
            fullName: cleanLettersOnly(data.fullName),
            phone: cleanPhone(data.phone),
            email: data.email,
        };

        if (data.company && data.company.trim()) {
            address.company = data.company.trim();
        }

        if (state.shippingType === 'return' && type === 'destination') {
        } else if (data.rfc && data.rfc.trim()) {
            address.rfc = data.rfc.trim();
        }

        const interior = truncate(data.internalNumber, 5);
        if (interior) {
            address.interiorNumber = interior;
        }

        const refs = truncate(data.reference, 25);
        if (refs) {
            address.references = refs;
        }

        return address;
    };

    const mapAddressForQuote = (data: AddressData, type: 'origin' | 'destination') => ({
        type,
        postalCode: data.zipCode,
        city: data.city || 'Ciudad',
        state: data.state || 'Estado',
        country: data.country || 'MX'
    });

    const mapPackages = (packages: PackageData[]): Package[] =>
        packages.map(pkg => ({
            packageType: "Caja",
            productType: pkg.productTypeCode + " - " + pkg.productTypeDescription,
            weightKg: Number(pkg.weight),
            lengthCm: Number(pkg.length),
            widthCm: Number(pkg.width),
            heightCm: Number(pkg.height),
            ...(pkg.savePackage ? { alias: pkg.alias || "" } : {}),
            items: pkg.products.map(prod => ({
                name: prod.name,
                sku: prod.sku,
                unitPrice: Number(prod.price),
                quantity: Number(prod.quantity),
                currency: 'MXN'
            }))
        }));

    const effectiveInsurancePrice = state.insurance.active ? state.insurance.cost : 0;

    const essentialFieldsKey = JSON.stringify(state.packages.map(p => ({
        weight: p.weight,
        length: p.length,
        width: p.width,
        height: p.height
    })));

    useEffect(() => {
        setIsQuoted(false);
        selectPackaging(null);
    }, [state.remitter.zipCode, state.addressee.zipCode, essentialFieldsKey, selectPackaging]);

    const validateQuoteData = useMemo(() => () => {
        const { remitter, addressee, packages } = state;
        const errors: any = {
            remitter: {},
            addressee: {},
            packages: {}
        };

        if (!remitter.zipCode?.length || remitter.zipCode.length !== 5) {
            errors.remitter.zipCode = "Código postal de 5 dígitos.";
        } else if (!remitter.state || !remitter.city) {
            errors.remitter.zipCode = "Código postal no encontrado.";
        }

        if (!remitter.state) errors.remitter.state = "Estado obligatorio.";
        if (!remitter.city) errors.remitter.city = "Ciudad obligatoria.";

        if (!addressee.zipCode?.length || addressee.zipCode.length !== 5) {
            errors.addressee.zipCode = "Código postal de 5 dígitos.";
        } else if (!addressee.state || !addressee.city) {
            errors.addressee.zipCode = "Código postal no encontrado.";
        }

        if (!addressee.state) errors.addressee.state = "Estado obligatorio.";
        if (!addressee.city) errors.addressee.city = "Ciudad obligatoria.";

        packages.forEach((pkg) => {
            const pkgErrors: any = {};
            if (!pkg.weight || Number(pkg.weight) <= 0) pkgErrors.weight = "Peso obligatorio.";
            if (!pkg.length || Number(pkg.length) <= 0) pkgErrors.length = "Longitud obligatoria.";
            if (!pkg.width || Number(pkg.width) <= 0) pkgErrors.width = "Ancho obligatoria.";
            if (!pkg.height || Number(pkg.height) <= 0) pkgErrors.height = "Altura obligatoria.";
            if (!pkg.productTypeCode) pkgErrors.productTypeCode = "Tipo de producto obligatorio.";

            if (pkg.savePackage && !pkg.alias.trim()) {
                pkgErrors.alias = "Alias obligatorio.";
            }

            if (Object.keys(pkgErrors).length > 0) {
                errors.packages[pkg.id] = pkgErrors;
            }
        });

        const hasErrors = Object.keys(errors.remitter).length > 0 ||
            Object.keys(errors.addressee).length > 0 ||
            Object.keys(errors.packages).length > 0;

        return hasErrors ? errors : null;
    }, [state]);

    const isReady = useMemo(() => {
        return validateQuoteData() === null;
    }, [validateQuoteData]);

    const validateCreateShipmentData = () => {
        const { remitter, addressee, packages } = state;
        const errors: any = {
            remitter: {},
            addressee: {},
            packages: {}
        };

        let hasErrors = false;

        if (!remitter.fullName?.trim()) errors.remitter.fullName = "El nombre es obligatorio.";
        if (cleanPhone(remitter.phone).length !== 10) errors.remitter.phone = "El teléfono debe ser de 10 dígitos.";
        if (!remitter.street?.trim()) errors.remitter.street = "La calle es obligatoria.";
        if (remitter.zipCode?.length !== 5) errors.remitter.zipCode = "Código postal de 5 dígitos.";
        if (remitter.colony === 'Otro' && !remitter.customColony?.trim()) {
            errors.remitter.customColony = "Nombre de colonia obligatorio.";
        } else if (!remitter.colony) {
            errors.remitter.colony = "La colonia es obligatoria.";
        }
        if (!remitter.state) errors.remitter.state = "Estado obligatorio.";
        if (!remitter.city) errors.remitter.city = "Ciudad obligatoria.";
        if (!remitter.email?.trim() || !remitter.email.includes('@')) errors.remitter.email = "Email inválido.";
        if (remitter.saveAddress && !remitter.alias?.trim()) errors.remitter.alias = "Alias obligatorio.";
        if (remitter.rfc && remitter.rfc.trim().length > 0 && (remitter.rfc.trim().length < 12 || remitter.rfc.trim().length > 13)) errors.remitter.rfc = "RFC de 12 a 13 caracteres.";

        if (!addressee.fullName?.trim()) errors.addressee.fullName = "El nombre es obligatorio.";
        if (cleanPhone(addressee.phone).length !== 10) errors.addressee.phone = "El teléfono debe ser de 10 dígitos.";
        if (!addressee.street?.trim()) errors.addressee.street = "La calle es obligatoria.";
        if (addressee.zipCode?.length !== 5) errors.addressee.zipCode = "Código postal de 5 dígitos.";
        if (addressee.colony === 'Otro' && !addressee.customColony?.trim()) {
            errors.addressee.customColony = "Nombre de colonia obligatorio.";
        } else if (!addressee.colony) {
            errors.addressee.colony = "La colonia es obligatoria.";
        }
        if (!addressee.state) errors.addressee.state = "Estado obligatorio.";
        if (!addressee.city) errors.addressee.city = "Ciudad obligatoria.";
        if (!addressee.email?.trim() || !addressee.email.includes('@')) errors.addressee.email = "Email inválido.";
        if (addressee.saveAddress && !addressee.alias?.trim()) errors.addressee.alias = "Alias obligatorio.";
        if (addressee.rfc && addressee.rfc.trim().length > 0 && (addressee.rfc.trim().length < 12 || addressee.rfc.trim().length > 13)) errors.addressee.rfc = "RFC de 12 a 13 caracteres.";

        packages.forEach((pkg) => {
            const pkgErrors: any = {};
            if (!pkg.weight || Number(pkg.weight) <= 0) pkgErrors.weight = "Obligatorio.";
            if (!pkg.length || Number(pkg.length) <= 0) pkgErrors.length = "Obligatorio.";
            if (!pkg.width || Number(pkg.width) <= 0) pkgErrors.width = "Obligatorio.";
            if (!pkg.height || Number(pkg.height) <= 0) pkgErrors.height = "Obligatorio.";
            if (!pkg.productTypeCode) pkgErrors.productTypeCode = "Obligatorio.";

            if (Object.keys(pkgErrors).length > 0) {
                errors.packages[pkg.id] = pkgErrors;
            }
        });

        if (Object.keys(errors.remitter).length > 0 ||
            Object.keys(errors.addressee).length > 0 ||
            Object.keys(errors.packages).length > 0) {
            hasErrors = true;
        }

        return hasErrors ? errors : null;
    };

    const handleQuoteAction = useMemo(() => async () => {
        const validationErrors = validateQuoteData();
        if (validationErrors) {
            setErrors(validationErrors);
            if (Object.keys(validationErrors.remitter).length > 0) setIsRemitterEditing(true);
            if (Object.keys(validationErrors.addressee).length > 0) setIsAddresseeEditing(true);
            if (Object.keys(validationErrors.packages).length > 0) setIsPackageEditing(true);

            showNotification("Datos incompletos", "Por favor, completa los campos requeridos para cotizar.", 'warning', 5000);
            return;
        }

        setIsQuoted(true);

        const requestPayload = {
            addresses: [
                mapAddressForQuote(state.remitter, 'origin'),
                mapAddressForQuote(state.addressee, 'destination')
            ],
            packages: state.packages.map(p => ({
                typePackage: "Caja",
                length: Number(p.length),
                height: Number(p.height),
                width: Number(p.width),
                weight: Number(p.weight),
                typeProduct: p.productTypeDescription,
                savePackage: p.savePackage || false,
                ...(p.savePackage ? { alias: p.alias || "" } : {}),
                products: p.products.map(prod => ({
                    name: truncate(prod.name, 50) || "Producto",
                    sku: truncate(prod.sku, 20) || "N/A",
                    price: Number(prod.price) || 0,
                    quanty: Number(prod.quantity) || 1
                }))
            })),
            safeShipping: state.insurance.active
        };

        await getQuotes(requestPayload as any);
    }, [state, validateQuoteData, setErrors, setIsRemitterEditing, setIsAddresseeEditing, setIsPackageEditing, showNotification, getQuotes]);

    const [hasAutoQuoted, setHasAutoQuoted] = useState(false);

    useEffect(() => {
        if (!isModalCreateShipmentOpen) {
            setHasAutoQuoted(false);
        }
    }, [isModalCreateShipmentOpen]);

    useEffect(() => {
        if (isModalCreateShipmentOpen && !isQuoted && !loadingQuotes && !hasAutoQuoted) {
            const hasNoErrors = validateQuoteData() === null;
            if (hasNoErrors) {
                setHasAutoQuoted(true);
                handleQuoteAction();
            }
        }
    }, [isModalCreateShipmentOpen, isQuoted, loadingQuotes, validateQuoteData, handleQuoteAction, hasAutoQuoted]);

    const handleCreateShipment = async () => {
        const validationErrors = validateCreateShipmentData();
        if (validationErrors) {
            setErrors(validationErrors);

            if (Object.keys(validationErrors.remitter).length > 0) setIsRemitterEditing(true);
            if (Object.keys(validationErrors.addressee).length > 0) setIsAddresseeEditing(true);
            if (Object.keys(validationErrors.packages).length > 0) setIsPackageEditing(true);

            showNotification("Información incompleta", "Revise la información del envío y vuelva a intentarlo.", 'error', 5000);
            return;
        }

        const { remitter, addressee, insurance, selectedPackaging, packages } = state;

        if (!selectedPackaging) {
            showNotification("Falta paquetería", "Selecciona una paquetería.", 'warning', 5000);
            return;
        }

        const buildAddressPayload = (data: AddressData, type: 'origin' | 'destination') => {
            if (data.savedAddressId && !String(data.savedAddressId).startsWith('zip-')) {
                return { uid: data.savedAddressId };
            }
            const addrPayload: any = {
                ...mapAddress(data, type),
                saveAddress: data.saveAddress || false,
            };

            if (data.saveAddress && data.alias && data.alias.trim()) {
                addrPayload.alias = data.alias.trim();
            }

            return addrPayload;
        };

        const originAddr = buildAddressPayload(remitter, 'origin');
        const destAddr = buildAddressPayload(addressee, 'destination');

        const payload: any = {
            currency: 'MXN',
            declaredValue: Number(insurance.declaredValue) || 0,
            safeShipping: insurance.active,
            status: 'pending',
            selectedCarrierQuote: {
                uid: selectedPackaging.id
            },
            packages: mapPackages(packages)
        };

        if (state.shippingType === 'from_order' && state.selectedOrder?.uid) {
            payload.orderUid = state.selectedOrder.uid;
        }

        if ('uid' in originAddr) {
            payload.originAddressUid = originAddr.uid;
        } else {
            payload.originAddress = originAddr;
        }

        if ('uid' in destAddr) {
            payload.destinationAddressUid = destAddr.uid;
        } else {
            payload.destinationAddress = destAddr;
        }

        try {
            const result = await createQuote(payload);
            if (result) {
                showNotification("¡Éxito!", "La orden ha sido generada.", 'success', 3000);
                refreshBalance(true);
                if (onSuccess) onSuccess();
                const targetPath = state.shippingType === 'from_order' ? '/shipping/orders' : '/shipping/history';
                navigate(targetPath);
                closeModalCreateShipment();
                return result;
            }
        } catch (error: any) {
            const status = error.response?.status;
            const msg = error.response?.data?.message || "Error al generar la orden.";

            if (status === 402) {
                showNotification("Saldo insuficiente", msg, 'error', 5000);
                window.dispatchEvent(new CustomEvent('open-wallet-modal'));
            } else if (status === 400) {
                showNotification("Error de validación", "Error de validación en los datos del envío.", 'error', 5000);
            } else if (status === 409) {
                showNotification("Cotización expirada", "La cotización seleccionada expiró. Por favor, cotiza de nuevo.", 'error', 5000);
            } else {
                showNotification("Error", msg, 'error', 5000);
            }
        }
    };

    const isIncompleteData = useMemo(() => {
        const { remitter, addressee, packages } = state;
        if (!remitter.zipCode || remitter.zipCode.length < 5) return true;
        if (!addressee.zipCode || addressee.zipCode.length < 5) return true;

        return packages.some(pkg =>
            !pkg.length && Number(pkg.length) <= 0 &&
            !pkg.width && Number(pkg.width) <= 0 &&
            !pkg.height && Number(pkg.height) <= 0 &&
            !pkg.weight && Number(pkg.weight) <= 0
        );
    }, [state]);

    return {
        state,
        isReady,
        isQuoted,
        isCreating,
        isIncompleteData,
        effectiveInsurancePrice,
        handleQuote: () => setIsQuoted(true),
        handleSelectPackaging: selectPackaging,
        handleCreateShipment,
        handleQuoteAction,
        hasAutoQuoted,
        quotes,
        loadingQuotes
    };
};