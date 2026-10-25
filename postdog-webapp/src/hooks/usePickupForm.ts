import { useState, useMemo, useEffect } from 'react';
import {
    SchedulePickupForm,
    Option,
    ScheduledPickup,
    ShipmentOption,
    mockCarrierOptions,
    mockShipmentOptions
} from '../types';
import { useNotification } from '../context/NotificationContext';
import PickupService from '../services/PickupService';
import { enrichPickupData } from '../utils/pickup.utils';

export const usePickupForm = (onSuccess?: (data: any) => void, useMockData: boolean = false) => {
    const { showNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<SchedulePickupForm>({
        carrier: '',
        referenceOrder: '',
        pickupAddress: '',
        pickupDate: '',
    });

    const [carrierOptions, setCarrierOptions] = useState<Option[]>([]);
    const [shipmentOptions, setShipmentOptions] = useState<ShipmentOption[]>([]);

    const pickupDateOptions: Option[] = [
        { value: 'Hoy', label: 'Hoy' },
        { value: 'Mañana', label: 'Mañana' },
    ];

    useEffect(() => {
        if (isModalOpen) {
            const loadCarriers = async () => {
                if (useMockData) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setCarrierOptions(mockCarrierOptions);
                } else {
                    const carriers = await PickupService.getCarriers();
                    setCarrierOptions(carriers);
                }
            };
            loadCarriers();
        }
    }, [isModalOpen, useMockData]);

    useEffect(() => {
        if (formData.carrier) {
            const loadShipments = async () => {
                if (useMockData) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setShipmentOptions(mockShipmentOptions[formData.carrier] || []);
                } else {
                    const shipments = await PickupService.getPendingShipments(formData.carrier);
                    setShipmentOptions(shipments);
                }
            };
            loadShipments();
        } else {
            setShipmentOptions([]);
        }
    }, [formData.carrier, useMockData]);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            carrier: '',
            referenceOrder: '',
            pickupAddress: '',
            pickupDate: '',
        });
        setShipmentOptions([]);
    };

    const handleInputChange = (field: keyof SchedulePickupForm, value: string | number) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            if (field === 'carrier') {
                newData.referenceOrder = '';
                newData.pickupAddress = '';
            }

            if (field === 'referenceOrder') {
                const selectedShipment = shipmentOptions.find(opt => opt.value === value);
                if (selectedShipment) {
                    newData.pickupAddress = selectedShipment.address;
                } else {
                    newData.pickupAddress = '';
                }
            }

            return newData;
        });
    };

    const handleFormSubmit = async () => {
        try {
            setIsLoading(true);
            let createdPickup: ScheduledPickup;

            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 800));

                createdPickup = {
                    id: Math.random().toString(),
                    pickupNumber: '144' + Math.floor(Math.random() * 1000),
                    carrier: formData.carrier,
                    pickupAddress: formData.pickupAddress,
                    pickupDate: formData.pickupDate,
                    status: 'PROGRAMMED'
                };
            } else {
                const today = new Date();
                let pickupDateStr = formData.pickupDate;
                
                if (formData.pickupDate === 'Hoy') {
                    pickupDateStr = today.toISOString().split('T')[0];
                } else if (formData.pickupDate === 'Mañana') {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    pickupDateStr = tomorrow.toISOString().split('T')[0];
                }

                createdPickup = await PickupService.createPickup({
                    carrierCode: formData.carrier,
                    referenceShipmentUid: formData.referenceOrder,
                    pickupDate: pickupDateStr
                });
            }

            showNotification(
                'Recolección programada',
                'Recolección programada exitosamente.',
                'success'
            );

            if (onSuccess) onSuccess(enrichPickupData(createdPickup));
            closeModal();
        } catch (error: any) {
            const statusCode = error.response?.status;
            let errorMessage = 'No se pudo programar la recolección';

            if (statusCode === 400) {
                errorMessage = 'Validación de negocio fallida.';
            } else if (statusCode === 401) {
                errorMessage = 'No autenticado.';
            } else if (statusCode === 404) {
                errorMessage = 'Envío de referencia no encontrado.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showNotification('Error', errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = useMemo(() => {
        return (
            formData.carrier !== '' &&
            formData.referenceOrder !== '' &&
            formData.pickupAddress.trim() !== '' &&
            formData.pickupDate !== ''
        );
    }, [formData]);

    return {
        isModalOpen,
        formData,
        isLoading,
        openModal,
        closeModal,
        handleInputChange,
        handleFormSubmit,
        carrierOptions,
        referenceOrderOptions: shipmentOptions,
        pickupDateOptions,
        isFormValid,
    };
};
