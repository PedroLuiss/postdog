import { useEffect, useRef, useState, useMemo } from 'react';
import { AddAddressFormData, AddAddressFormErrors } from '../types/addAddress.type';
import AddressServices from '../services/AddressService';
import { ZipCodeResponse, DataSaveAddress } from '../types';
import { useNotification } from '../context/NotificationContext';

const CLOSE_ANIMATION_DURATION = 300;

export interface UseAddAddressProps {
    onSave?: (data: AddAddressFormData) => Promise<boolean> | void;
    initialData?: DataSaveAddress | null;
}

export const useAddAddress = ({ onSave, initialData }: UseAddAddressProps = {}) => {
    const { showNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [fetchedColonies, setFetchedColonies] = useState<ZipCodeResponse[]>([]);
    const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
    const [isColonyManual, setIsColonyManual] = useState(false);
    const [isPostalCodeInvalid, setIsPostalCodeInvalid] = useState(false);
    const isEditing = !!initialData;
    const [formData, setFormData] = useState<AddAddressFormData>({
        alias: '',
        label: '',
        addressLine: '',
        interiorNumber: '',
        postalCode: '',
        colony: '',
        country: 'MX México',
        state: '',
        city: '',
        references: '',
        fullName: '',
        phone: '',
        email: '',
        company: '',
        rfc: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                alias: initialData.alias || '',
                label: initialData.type === 'origin' ? 'Origen' : initialData.type === 'destination' ? 'Destino' : 'Ambas',
                addressLine: initialData.addressLine || '',
                interiorNumber: initialData.interiorNumber || '',
                postalCode: initialData.postalCode || '',
                colony: initialData.colony || '',
                country: 'MX México',
                state: initialData.state || '',
                city: initialData.city || '',
                references: initialData.references || '',
                fullName: initialData.fullName || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                company: initialData.company || '',
                rfc: initialData.rfc || '',
            });
            setIsOpen(true);
        }
    }, [initialData]);

    useEffect(() => {
        if (isOpen) {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            setIsClosing(false);
            setVisible(true);
        } else if (visible) {
            setIsClosing(true);
            closeTimerRef.current = setTimeout(() => {
                setVisible(false);
                setIsClosing(false);
            }, CLOSE_ANIMATION_DURATION);
        }

        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, [isOpen, visible]);

    const dataState = isClosing ? 'closed' : 'open';
    const [errors, setErrors] = useState<AddAddressFormErrors>({});
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        handleClearForm();
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | number } }
    ) => {
        const { name, value } = e.target;
        let val = value as string;

        if (name === 'phone') {
            val = val.replace(/\D/g, '');
        }

        if (name === 'postalCode') {
            setIsColonyManual(false);
            if (val.length !== 5) {
                setFetchedColonies([]);
                setIsPostalCodeInvalid(false);
                setFormData(prev => ({
                    ...prev,
                    postalCode: val,
                    colony: '',
                    state: '',
                    city: ''
                }));
                return;
            }
        }

        if (name === 'colony' && val === 'Otro') {
            setIsColonyManual(true);
            const firstColony = fetchedColonies[0];
            setFormData(prev => ({
                ...prev,
                colony: '',
                state: firstColony?.state || prev.state,
                city: firstColony?.city || prev.city
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: val as any }));

        if (errors[name as keyof AddAddressFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleLabelChange = (label: 'Origen' | 'Destino' | 'Ambas') => {
        setFormData(prev => ({ ...prev, label }));
    };

    const handleClearForm = () => {
        setFormData({
            alias: '',
            label: '',
            addressLine: '',
            interiorNumber: '',
            postalCode: '',
            colony: '',
            country: 'MX México',
            state: '',
            city: '',
            references: '',
            fullName: '',
            phone: '',
            email: '',
            company: '',
            rfc: ''
        });
        setIsColonyManual(false);
        setIsPostalCodeInvalid(false);
        setErrors({});
        setFetchedColonies([]);
    };

    useEffect(() => {
        const fetchZipCodeData = async () => {
            if (formData.postalCode.length === 5) {
                setIsLoadingZipCode(true);
                if (!isEditing) {
                    setIsColonyManual(false);
                }
                try {
                    const data = await AddressServices.getZipCodeData(formData.postalCode);
                    const validData = data || [];
                    setFetchedColonies(validData);
                    setIsPostalCodeInvalid(validData.length === 0);
                    if (validData.length === 0) {
                        showNotification(
                            'Código postal no encontrado',
                            'El código postal ingresado no existe. Verifica e intenta de nuevo.',
                            'error'
                        );
                    } else {
                        const firstData = validData[0];
                        const savedColony = formData.colony;
                        const colonyInList = validData.some(c => c.colony === savedColony);

                        if (savedColony && !colonyInList) {
                            setIsColonyManual(true);
                        }

                        setFormData(prev => ({
                            ...prev,
                            state: firstData.state || '',
                            city: firstData.city || ''
                        }));
                    }
                } catch (error) {
                    setFetchedColonies([]);
                    setIsPostalCodeInvalid(true);
                    setFormData(prev => ({ ...prev, colony: '', state: '', city: '' }));
                    showNotification(
                        'Código postal no encontrado',
                        'El código postal ingresado no existe. Verifica e intenta de nuevo.',
                        'error'
                    );
                } finally {
                    setIsLoadingZipCode(false);
                }
            }
        };

        const timeoutId = setTimeout(() => {
            fetchZipCodeData();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [formData.postalCode]);

    const colonyOptions = useMemo(() => {
        const options = fetchedColonies.map(c => ({ value: c.colony, label: c.colony }));
        if (fetchedColonies.length > 0) {
            options.push({ value: 'Otro', label: 'Otro' });
        }
        return options;
    }, [fetchedColonies]);

    useEffect(() => {
        if (!formData.colony || isColonyManual) return;

        const selectedInfo = fetchedColonies.find(c => c.colony === formData.colony);
        if (selectedInfo) {
            setFormData(prev => ({
                ...prev,
                state: selectedInfo.state,
                city: selectedInfo.city
            }));
        }
    }, [formData.colony, fetchedColonies, isColonyManual]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.label) {
            showNotification(
                'Etiqueta requerida',
                'Por favor selecciona una etiqueta (Origen, Destino o Ambas).',
                'error'
            );
            return;
        }

        const newErrors: AddAddressFormErrors = {};

        if (!formData.alias.trim()) newErrors.alias = 'Requerido';
        if (!formData.addressLine.trim()) newErrors.addressLine = 'Requerido';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Requerido';
        if (!formData.colony.trim()) newErrors.colony = 'Requerido';
        if (!formData.fullName.trim()) newErrors.fullName = 'Requerido';
        if (!formData.phone.trim()) newErrors.phone = 'Requerido';
        if (!formData.email.trim()) newErrors.email = 'Requerido';
        if (isColonyManual && !formData.colony.trim()) {
            newErrors.colony = 'Requerido';
        }
        if (formData.rfc.trim() && (formData.rfc.trim().length < 12 || formData.rfc.trim().length > 13)) {
            newErrors.rfc = 'Debe tener entre 12 y 13 caracteres';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            console.log("Validation failed", newErrors);
            return;
        }

        const { rfc, company, interiorNumber, references, ...rest } = formData;

        const payload = {
            ...rest,
            company: company.trim() || null,
            interiorNumber: interiorNumber.trim() || null,
            references: references.trim() || null,
            rfc: (formData.label === 'Origen' || formData.label === 'Ambas') ? (rfc.trim() || null) : null
        };

        if (onSave) {
            const success = await onSave(payload as any);
            if (success) {
                closeModal();
            }
        } else {
            closeModal();
        }
    };

    return {
        isOpen,
        visible,
        isClosing,
        dataState,
        openModal,
        closeModal,
        formData,
        errors,
        colonyOptions,
        isLoadingZipCode,
        handleInputChange,
        handleLabelChange,
        handleClearForm,
        handleSubmit,
        isEditing,
        isColonyManual,
        isPostalCodeInvalid
    };
};
