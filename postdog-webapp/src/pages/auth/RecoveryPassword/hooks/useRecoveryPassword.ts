import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

export const useRecoveryPassword = () => {
    const navigate = useNavigate();
    const { requestPasswordReset, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: '' });
    const [step, setStep] = useState<"form" | "success" | "resend">("form");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const validate = () => {
        const newErrors = { email: '' };
        if (!email) {
            newErrors.email = 'El correo es obligatorio.';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            newErrors.email = 'Correo electrónico inválido.';
        }
        return newErrors;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const validationErrors = validate();
        setErrors(validationErrors);

        if (!validationErrors.email) {
            try {
                const response: any = await requestPasswordReset(email);
                
                if (response?.error) {
                    setErrorMsg(response.error);
                    setShowErrorModal(true);
                    return;
                }
                
                setStep("success");
            } catch (err: any) {
                console.error("Error en recovery:", err);
                setErrorMsg(err?.message || 'Hubo un problema al enviar el correo de recuperación.');
                setShowErrorModal(true);
            }
        }
    };

    const handleCloseErrorModal = () => setShowErrorModal(false);

    return {
        email,
        setEmail,
        loading,
        errors,
        step,
        setStep,
        showErrorModal,
        errorMsg,
        handleSubmit,
        handleCloseErrorModal,
        navigate
    };
};