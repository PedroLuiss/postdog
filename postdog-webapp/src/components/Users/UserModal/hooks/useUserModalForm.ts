import { useState, useMemo, useEffect } from 'react';
import { UserFormData } from '../types/UserModal.types';
import { useNotification } from '../../../../context/NotificationContext';
import { AdminUserService } from '../../../../services/AdminUserService';

export const useUserModalForm = (isOpen: boolean, onClose: () => void, onSubmitSuccess?: (user: any) => void) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        role_id: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                password: '',
                role_id: ''
            });
            setShowErrors(false);
        }
    }, [isOpen]);

    const errors = useMemo(() => {
        const errs: any = {};
        
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errs.email = 'El correo no es válido';
        }
        if (formData.firstName.trim().length < 2) {
            errs.firstName = 'El nombre es muy corto';
        }
        if (formData.lastName.trim().length < 2) {
            errs.lastName = 'El apellido es muy corto';
        }
        if (formData.phone.length !== 10) {
            errs.phone = 'Debe tener 10 dígitos';
        }
        if ((formData.password?.length || 0) < 6) {
            errs.password = 'Mínimo 6 caracteres';
        }
        if (!formData.role_id) {
            errs.role_id = 'Debe seleccionar un rol';
        }

        return errs;
    }, [formData]);

    const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (e: { target: { name: string; value: string | number } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as string }));
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            setShowErrors(true);
            return;
        }

        setIsLoading(true);
        try {
            const newUser = await AdminUserService.create(formData);
            showNotification('Éxito', 'Usuario creado correctamente', 'success');
            onSubmitSuccess?.(newUser);
            onClose();
        } catch (error: any) {
            console.error('Error creating user:', error);
            showNotification('Error', error.response?.data?.message || 'No se pudo crear el usuario', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        showErrors,
        isLoading,
        handleChange,
        handleSelectChange,
        handleSubmit
    };
};
