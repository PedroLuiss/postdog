import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useAppContext } from '../../../context/AppContext';

export const useRegister = () => {
    const appContext = useAppContext();
    const loginUser = appContext?.loginUser;
    const appUser = appContext?.user;
    const navigate = useNavigate();
    
    const { register, loading, loginWithFirebase } = useAuth();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({ 
        email: '', 
        password: '', 
        firstName: '', 
        lastName: '', 
        phone: '' 
    });
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
        const newErrors = { email: '', password: '', firstName: '', lastName: '', phone: '' };
        if (!email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            newErrors.email = 'El correo electrónico no es válido.';
        }

        if (!password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }

        if (!firstName) {
            newErrors.firstName = 'El nombre es obligatorio.';
        }

        if (!lastName) {
            newErrors.lastName = 'Los apellidos son obligatorios.';
        }

        if (!phone) {
            newErrors.phone = 'El teléfono es obligatorio.';
        } else if (phone.length < 10) {
            newErrors.phone = 'El teléfono debe tener 10 dígitos.';
        }

        return newErrors;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(x => x === '')) {
            try {
                const data = await register({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone_country_code: "+52",
                    phone_number: phone,
                    password,
                    accepted_terms: true
                });
                setTempUserData(data);
                localStorage.setItem('user', JSON.stringify(data));

                window.open('/dashboard', '_blank');
                setShowSuccessModal(true);
            } catch (err: any) {
                setErrorMessage(err.message || 'Ocurrió un error al intentar registrarte. Por favor, verifica tus datos e intenta de nuevo.');
                setShowErrorModal(true);
            }
        }
    };

    const handleConfirmSuccess = () => {
        window.location.href = process.env.REACT_APP_LANDING_URL || 'https://postdog.mx';
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
            setErrorMessage('Hubo un problema al autenticar con Google. Por favor, intenta de nuevo.');
            setShowErrorModal(true);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return {
        step, setStep,
        email, setEmail,
        password, setPassword,
        showPassword,
        firstName, setFirstName,
        lastName, setLastName,
        phone, setPhone,
        errors,
        loading,
        showSuccessModal,
        showErrorModal,
        setShowErrorModal,
        errorMessage,
        handleRegister,
        handleConfirmSuccess,
        handleLoginFirebase,
        togglePasswordVisibility,
        navigate
    };
};