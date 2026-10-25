import { useState, useMemo, useEffect } from 'react';
import { AdminUserService } from '../../../../services/AdminUserService';
import { useNotification } from '../../../../context/NotificationContext';
import { UserUI } from '../../../../types';

export const useAccountDetailsModal = (user: UserUI, onClose: () => void, onUpdateSuccess?: (user: any) => void) => {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        curp: user?.curp || '',
        ine: user?.ine || ''
    });

    const [files, setFiles] = useState<{ uid?: string, name: string, url: string, file?: File }[]>([]);
    const [showErrors, setShowErrors] = useState(false);
    const [serverErrors, setServerErrors] = useState<any>({});

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                curp: user.curp || '',
                ine: user.ine || ''
            });
            
            if (user.documents && user.documents.length > 0) {
                const existingFiles = user.documents.map(doc => ({
                    uid: doc.uid,
                    name: doc.fileName,
                    url: doc.url
                }));
                setFiles(existingFiles);
            } else {
                setFiles([]);
            }
            
            setShowErrors(false);
            setServerErrors({});
        }
    }, [user]);

    const errors = useMemo(() => {
        const errs: any = { ...serverErrors };
        
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errs.email = 'El correo no es válido';
        }
        if (formData.firstName.trim().length < 2) {
            errs.firstName = 'El nombre es muy corto';
        }
        if (formData.lastName.trim().length < 2) {
            errs.lastName = 'El apellido es muy corto';
        }
        if (formData.phone.replace(/\D/g, '').length !== 10) {
            errs.phone = 'Debe tener 10 dígitos';
        }
        if (formData.curp.length !== 18) {
            errs.curp = 'Debe tener 18 caracteres';
        }
        if (formData.ine.length !== 9) {
            errs.ine = 'Debe tener 9 dígitos';
        }
        
        if (files.length === 0) {
            errs.files = 'Debes subir al menos un documento';
        }

        return errs;
    }, [formData, serverErrors, files]);

    const isFormValid = Object.keys(errors).length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setServerErrors({});
        if (name === 'phone' || name === 'ine') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles).map(file => ({
                name: file.name,
                url: URL.createObjectURL(file),
                file: file
            }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleDownload = (file: { name: string, url: string }) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSave = async () => {
        // if (!isFormValid) {
        //     setShowErrors(true);
        //     return;
        // }

        setIsLoading(true);
        try {
            const newVerificationFiles = files.filter(f => f.file);

            const updatedUser = await AdminUserService.update(user.uid, {
                ...formData,
                verificationFiles: newVerificationFiles
            });

            if (onUpdateSuccess) {
                onUpdateSuccess(updatedUser);
            }

            showNotification('Éxito', 'Cuenta actualizada correctamente', 'success');
            onClose();
        } catch (error: any) {
            if (error.response?.status === 400) {
                const apiErrors: any = {};
                const responseData = error.response.data;

                if (responseData.errors && Array.isArray(responseData.errors)) {
                    responseData.errors.forEach((err: any) => {
                        const fieldName = err.field === 'phone_number' ? 'phone' : err.field;
                        apiErrors[fieldName] = err.messages[0];
                    });
                } else if (responseData.field && responseData.message) {
                    const fieldName = responseData.field === 'phone_number' ? 'phone' : responseData.field;
                    apiErrors[fieldName] = responseData.message;
                }

                setServerErrors(apiErrors);
                setShowErrors(true);

                const errorMessage = responseData.message || responseData.errors?.[0]?.messages[0] || 'Error de validación';
                showNotification('Error de Validación', errorMessage, 'error');
            } else {
                showNotification('Error', 'No se pudo actualizar la cuenta', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        files,
        errors,
        showErrors,
        isLoading,
        handleChange,
        handleFileUpload,
        handleDownload,
        handleSave
    };
};
