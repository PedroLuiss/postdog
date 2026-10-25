import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';

export const useLogin = () => {
    const appContext = useAppContext();
    const loginUser = appContext?.loginUser;
    const appUser = appContext?.user;
    
    const { login, loading, loginWithFirebase } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tempUserData, setTempUserData] = useState<any>(null);

    useEffect(() => {
        if (appUser && !showSuccessModal && !showErrorModal) {
            navigate("/");
        }
    }, [appUser, navigate, showSuccessModal, showErrorModal]);

    const validate = () => {
        const newErrors = { email: '', password: '' };
        if (!email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            newErrors.email = 'El correo electrónico no es válido.';
        }
        
        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        }
        return newErrors;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        
        if (!validationErrors.email && !validationErrors.password) {
            try {
                const data = await login({ email, password });
                setTempUserData(data);
                localStorage.setItem('user', JSON.stringify(data));
                
                window.open('/dashboard', '_blank');
                setShowSuccessModal(true);
            } catch (err: any) {
                const serverMessage = err.response?.data?.message;
                setErrorMessage(serverMessage || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
                setShowErrorModal(true);
            }
        }
    };

    const handleConfirmSuccess = () => {
        window.location.href = process.env.REACT_APP_LANDING_URL || 'https://postdog.mx';
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginFirebase = async () => {
        try {
            const data = await loginWithFirebase();
            setTempUserData(data);
            localStorage.setItem('user', JSON.stringify(data));
            
            window.open('/dashboard', '_blank');
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error(err);
            const serverMessage = err.response?.data?.message;
            setErrorMessage(serverMessage || 'Hubo un problema al autenticar con Google. Por favor, intenta de nuevo.');
            setShowErrorModal(true);
        }
    };

    return {
        email,
        password,
        showPassword,
        errors,
        loading,
        setEmail,
        setPassword,
        handleLogin,
        loginWithFirebase,
        handleLoginFirebase,
        togglePasswordVisibility,
        navigate,
        showSuccessModal,
        showErrorModal,
        setShowErrorModal,
        errorMessage,
        handleConfirmSuccess,
    };
};
