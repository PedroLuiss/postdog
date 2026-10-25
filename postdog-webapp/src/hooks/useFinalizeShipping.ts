import { useEffect, useMemo, useState } from 'react';
import { StepOneStoredData, useStepOne } from './useStepOne';
import { useStepTwo } from './useStepTwo';
import { useStepThree } from './useStepThree';
import { getFromStorage, saveToStorage } from '../utils/storage.utils';
import { generateUniqueId } from '../utils/id-generator';
import { Package, Shipment } from '../types';
import { useUpdateShipment } from './useUpdateShipment';

interface useFinalizeShippingProps {
    order: Shipment | null;
    isOpen?: boolean;
    closeDrawerEditOrde: () => void
}

export const useFinalizeShipping = ({ order, isOpen, closeDrawerEditOrde }: useFinalizeShippingProps) => {
    const { updateShipmentModal, isLoading: isUpdating, error: updateError, data: dataUpdateShipmentModal, resetUpdateState } = useUpdateShipment();

    const stepOne = useStepOne();
    const stepTwo = useStepTwo();
    const stepThree = useStepThree();

    const { validateStep: validatePackages, errors: packageErrors } = stepTwo;
    const { validateStep: validatePayment, errors: paymentErrors } = stepThree;

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
    const [isEditingCourier, setIsEditingCourier] = useState(false);

    useEffect(() => {
        if (order) {
            // const data = {
            //     addresseeData: {
            //         savedAddress: "addr_789",
            //         streetAndNumber: order.recipient.address,
            //         neighborhood: "Polanco",
            //         postalCode: "3001",
            //         interiorNumber: "213123",
            //         city: "Barquisimeto",
            //         state: "Jalisco",
            //         country: "México",
            //         fullName: order.recipient.name,
            //         reference: "21312312324",
            //         phone: "522342343242",
            //         email: "peluisrodriguez2@gmail.com",
            //         company: "desconocido",
            //         rfc: "",
            //         showAliasField: false,
            //         alias: ""
            //     },
            //     remitterData: {
            //         savedAddress: "addr_456",
            //         streetAndNumber: "Barquisimeto, centro",
            //         neighborhood: "Polanco",
            //         postalCode: "3001",
            //         interiorNumber: "213123",
            //         city: "Barquisimeto",
            //         state: "Morelos",
            //         country: "México",
            //         fullName: "Pedro ramosne",
            //         reference: "21323123",
            //         phone: "522342343242",
            //         email: "peluisrodriguez2@gmail.com",
            //         company: "desconocido",
            //         rfc: "",
            //         showAliasField: false,
            //         alias: ""
            //     }
            // }
            // const storedData = getFromStorage<StepOneStoredData>('stepOneData');

            // if (storedData) {
            //     stepOne.setRemitterData(storedData.remitterData);
            //     stepOne.setAddresseeData(storedData.addresseeData);
            // } else {
            //     stepOne.setRemitterData(data.remitterData);
            //     stepOne.setAddresseeData(data.addresseeData);
            // }



            const packages = [
                {
                    "alias": "Caja 1",
                    "packageType": "BOX_M",
                    "productType": "ropa",
                    "weightKg": 1.3,
                    "lengthCm": 20,
                    "widthCm": 15,
                    "heightCm": 10,
                    "items": [
                        { "name": "Playera", "sku": "TS-001", "unitPrice": 299.9, "quantity": 1 },
                        { "name": "Pantalón", "sku": "PT-003", "unitPrice": 799.9, "quantity": 1 }
                    ]
                }
            ];

            const storedPackages = getFromStorage<Package[]>('stepTwoData');
            if (storedPackages && Array.isArray(storedPackages)) {
                const Packages = storedPackages.map(pkg => ({
                    ...pkg,
                    id: generateUniqueId(),
                    items: pkg.items.map(prod => ({
                        ...prod,
                        id: generateUniqueId(),
                    }))
                }));
                stepTwo.setPackages(Packages);
            } else {
                const packagesWithNewIds = packages.map(pkg => ({
                    ...pkg,
                    id: generateUniqueId(),
                    items: pkg.items.map(prod => ({
                        ...prod,
                        id: generateUniqueId(),
                    }))
                }));

                stepTwo.setPackages(packagesWithNewIds);
            }




            stepThree.handleSelectOption(order.carrier.id);
        }
    }, [order, stepOne.setRemitterData, stepOne.setAddresseeData]);


    useEffect(() => {
        if (isOpen) {
            resetUpdateState();
        }
    }, [isOpen, resetUpdateState]);


    const addressHandlers = useMemo(() => ({
        onEdit: () => setIsEditingAddress(true),
        onCancel: () => setIsEditingAddress(false),
        onSave: () => {
            const remitterErrors = stepOne.validateFormStepOne(stepOne.remitterData);
            const addresseeErrors = stepOne.validateFormStepOne(stepOne.addresseeData);
            stepOne.setRemitterErrors(remitterErrors);
            stepOne.setAddresseeErrors(addresseeErrors);

            const isValid = Object.keys(remitterErrors).length === 0 && Object.keys(addresseeErrors).length === 0;
            if (isValid) {
                saveToStorage('stepOneData', { remitterData: stepOne.remitterData, addresseeData: stepOne.addresseeData });
                setIsEditingAddress(false);
            }
        },
        handleAddressSelect: stepOne.handleAddressSelect,
        onInputChange: stepOne.handleInputChange,
        onClearForm: stepOne.clearForm,
    }), [stepOne]);

    const packageHandlers = useMemo(() => ({
        onEdit: (pkg: Package) => setEditingPackageId(pkg.id ?? ""),
        onCancel: () => setEditingPackageId(null),
        onSave: () => {
            if (validatePackages()) setEditingPackageId(null);
            saveToStorage('stepTwoData', stepTwo.packages);

        },
        onUpdatePackage: stepTwo.handleUpdatePackage,
        onAddProduct: stepTwo.handleAddProduct,
        onDeleteProduct: stepTwo.handleDeleteProduct,
        onUpdateProduct: stepTwo.handleUpdateProduct,
        onDeletePackage: stepTwo.handleDeletePackage,
        onClearPackage: stepTwo.handleClearPackage,
        onDuplicateProduct: stepTwo.handleDuplicateProduct,
        onClearProduct: stepTwo.handleClearProduct,
    }), [stepTwo, validatePackages]);

    const courierHandlers = useMemo(() => ({
        onEdit: () => setIsEditingCourier(true),
        onSelect: (optionId: string) => {
            console.log(optionId);

            stepThree.handleSelectOption(optionId);
            setIsEditingCourier(false);
        },
        onSort: stepThree.handleSort,
        setIsFilterOpen: stepThree.setIsFilterOpen,
        isFilterOpen: stepThree.isFilterOpen,
        availableCarriers: stepThree.availableCarriers,
        selectedCarriers: stepThree.selectedCarriers,
        setSelectedCarriers: stepThree.setSelectedCarriers,
    }), [stepThree]);

    const handleSend = async () => {
        const areAddressesValid = Object.keys(stepOne.validateFormStepOne(stepOne.remitterData)).length === 0 && Object.keys(stepOne.validateFormStepOne(stepOne.addresseeData)).length === 0;
        const arePackagesValid = validatePackages();
        const isPaymentValid = validatePayment();

        stepOne.setRemitterErrors(stepOne.validateFormStepOne(stepOne.remitterData));
        stepOne.setAddresseeErrors(stepOne.validateFormStepOne(stepOne.addresseeData));

        if (!areAddressesValid || !arePackagesValid || !isPaymentValid) {
            console.error("Validación fallida. No se puede enviar.");
            return;
        }

        const finalData = {
            addresses: { remitterData: stepOne.remitterData, addresseeData: stepOne.addresseeData },
            packages: stepTwo.packages,
            selectedCourier: stepThree.selectedOption,
            pawSafe: { active: stepThree.isPawSafeActive, value: stepThree.declaredValue }
        };

        if (order?.id) {
            const success = await updateShipmentModal(order.id, finalData);

            if (success) {
                console.log("¡Actualización exitosa!");
                closeDrawerEditOrde();
            } else {
                console.error("La actualización falló. El error se mostrará en la UI.");
            }
        } else {
            console.error("No se encontró ID de la orden para actualizar.");
        }
    };


    return {
        isEditingAddress,
        editingPackageId,
        isEditingCourier,
        isPawSafeActive: stepThree.isPawSafeActive,

        remitterData: stepOne.remitterData,
        addresseeData: stepOne.addresseeData,
        remitterErrors: stepOne.remitterErrors,
        addresseeErrors: stepOne.addresseeErrors,
        remitterColonies: stepOne.remitterColonies,
        addresseeColonies: stepOne.addresseeColonies,
        isLoadingRemitterZip: stepOne.isLoadingRemitterZip,
        isLoadingAddresseeZip: stepOne.isLoadingAddresseeZip,

        packages: stepTwo.packages,
        packageErrors,

        filteredAndSortedOptions: stepThree.filteredAndSortedOptions,
        selectedOption: stepThree.selectedOption,
        sortConfig: stepThree.sortConfig,
        declaredValue: stepThree.declaredValue,
        paymentErrors,

        setIsPawSafeActive: stepThree.handlePawSafeToggle,
        setDeclaredValue: stepThree.setDeclaredValue,

        addressHandlers,
        packageHandlers,
        courierHandlers,
        handleSend,
        isUpdating,
        updateError,
        dataUpdateShipmentModal
    };
};