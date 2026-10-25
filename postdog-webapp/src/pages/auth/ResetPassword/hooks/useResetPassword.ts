import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth'; 

export const useResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword, loading } = useAuth();
    
    const tokenFromUrl = searchParams.get('token') || '';
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

    const validate = () => {
        const newErrors = { password: '', confirmPassword: '' };
        
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 8 || !/\d/.test(password) || !/[a-z]/.test(password)) {
            newErrors.password = 'Debe tener mínimo 8 caracteres con número y minúscula.';
        }
        
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar tu contraseña.';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (!validationErrors.password && !validationErrors.confirmPassword) {
            try {
                const response: any = await resetPassword({
                    newPassword: password,
                    token: tokenFromUrl
                });
                
                
                if (response?.error) {
                    setErrorMsg(response.error);
                    setIsErrorOpen(true);
                    return;
                }
                
                
                setIsSuccessOpen(true);
            } catch (err: any) {
                console.error("Error al restablecer contraseña:", err);
                setErrorMsg(err?.message || 'No se pudo actualizar la contraseña. Por favor intenta de nuevo.');
                setIsErrorOpen(true);
            }
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const closeErrorModal = () => setIsErrorOpen(false);

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        showConfirmPassword,
        isSuccessOpen,
        isErrorOpen,
        errorMsg,
        errors,
        loading,
        tokenFromUrl,
        setErrors,
        handleSubmit,
        toggleShowPassword,
        toggleShowConfirmPassword,
        closeErrorModal,
        navigate
    };
};