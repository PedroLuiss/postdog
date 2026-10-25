import { CircularProgress } from '@mui/material';
import { ArrowRight, Truck, Store, Package, Eye, EyeOff } from 'lucide-react';
import { LoginSuccessModal } from '../../components/LoginForm/LoginSuccessModal';
import { GoogleIcon } from '../../components/ui/Icon/GoogleIcon';

import styles from './Register.module.scss';
import { useRegister } from './hooks/useRegister';
import PostDogLogoMascot from "../../assets/Logos/logo_login.png";
import { AuthErrorModal } from '../../components/AuthErrorModal/AuthErrorModal';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from './constant';

const Register = () => {
    const {
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
    } = useRegister();

    return (
        <div className={styles['register-page']}>
            {showSuccessModal && (
                <LoginSuccessModal 
                    onConfirm={handleConfirmSuccess} 
                    title="¡Perfecto!"
                    description="Registro exitoso. ¡Bienvenido a la manada!"
                />
            )}

            <AuthErrorModal 
                isOpen={showErrorModal} 
                onClose={() => setShowErrorModal(false)} 
                title="Error en el registro"
                description={errorMessage}
            />
            
            <div className={styles['register-page__hero']}>
                <div className={styles['register-page__hero-content']}>
                    <h1 className={styles['register-page__hero-title']}>
                        Tu <span>nuevo compañero</span> para enviar
                    </h1>
                    <p className={styles['register-page__hero-subtitle']}>
                        Regístrate y descubre cómo Postdog facilita tus envíos.
                    </p>

                    <div className={styles['register-page__benefits']}>
                        <div className={styles['register-page__benefit-item']}>
                            <Truck className={styles['register-page__benefit-icon']} size={24} />
                            <div className={styles['register-page__benefit-text']}>
                                <h3>Envía sin complicaciones.</h3>
                                <p>Postdog rastrea la mejor tarifa por ti.</p>
                            </div>
                        </div>
                        <div className={styles['register-page__benefit-item']}>
                            <Store className={styles['register-page__benefit-icon']} size={24} />
                            <div className={styles['register-page__benefit-text']}>
                                <h3>Integra tu tienda fácilmente.</h3>
                                <p>Tus pedidos llegan solitos, como perritos bien entrenados.</p>
                            </div>
                        </div>
                        <div className={styles['register-page__benefit-item']}>
                            <Package className={styles['register-page__benefit-icon']} size={24} />
                            <div className={styles['register-page__benefit-text']}>
                                <h3>Ladra y vamos por tus paquetes.</h3>
                                <p>Ok, no literalmente... pero sí los recolectamos por ti.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles['register-page__hero-image-box']}>
                        <img src={PostDogLogoMascot}  alt="Mascota" className={styles['register-page__hero-dog']} />
                    </div>
                </div>
            </div>

            <div className={styles['register-page__form-side']}>
                <div className={styles['register-page__form-container']}>
                    
                    <div className={styles['register-page__nav-link']}>
                        <a onClick={() => navigate("/login")}>
                            ¿Ya eres parte de la manada? <span>Inicia sesión</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1" 
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className={styles['register-page__header']}>
                                    <h2 className={styles['register-page__title']}>Únete a <span>Postdog</span></h2>
                                    <p className={styles['register-page__subtitle']}>Empieza a enviar con la manada más rápida</p>
                                </div>

                                <button className={styles['register-page__submit-btn--complete']} onClick={() => setStep(2)}>
                                    Completar formulario
                                </button>

                                <div className={styles['register-page__divider']}>
                                    <span><i>o</i></span>
                                </div>

                                <button 
                                    type="button" 
                                    className={styles['register-page__google-btn']}
                                    onClick={handleLoginFirebase}
                                    disabled={loading}
                                >
                                    <GoogleIcon className={styles['register-page__google-btn__icon']} />
                                    <span className={styles['register-page__google-btn__text']}>Continuar con Google</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2" 
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <button className={styles['register-page__back-btn']} onClick={() => setStep(1)}>
                                    <ArrowRight size={16} style={{transform: 'rotate(180deg)'}}/> Volver
                                </button>

                                <div className={`${styles['register-page__header']} ${styles['register-page__header--left']}`}>
                                    <h2 className={styles['register-page__title']}>Regístrate en <span>Postdog</span></h2>
                                </div>

                                <form className={styles['register-page__form']} onSubmit={handleRegister}>
                                    <div className={styles['register-page__field']}>
                                        <label className={styles['register-page__label']}>Correo electrónico<span>*</span></label>
                                        <input 
                                            type="email" 
                                            className={`${styles['register-page__input']} ${errors.email ? styles['register-page__input--invalid'] : ''}`} 
                                            placeholder="tu@email.com" 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                        />
                                        {errors.email && <span className={styles['register-page__error']}>{errors.email}</span>}
                                    </div>

                                    <div className={styles['register-page__field']}>
                                        <label className={styles['register-page__label']}>Contraseña<span>*</span></label>
                                        <div className={styles['register-page__input-wrapper']}>
                                            <input 
                                                type={showPassword ? 'text' : 'password'} 
                                                className={`${styles['register-page__input']} ${styles['register-page__input--password']} ${errors.password ? styles['register-page__input--invalid'] : ''}`} 
                                                placeholder="••••••••" 
                                                value={password} 
                                                onChange={e => setPassword(e.target.value)} 
                                            />
                                            <button type="button" className={styles['register-page__password-toggle']} onClick={togglePasswordVisibility}>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.password && <span className={styles['register-page__error']}>{errors.password}</span>}
                                    </div>

                                    <div className={styles['register-page__field']}>
                                        <label className={styles['register-page__label']}>Nombre<span>*</span></label>
                                        <input 
                                            type="text" 
                                            className={`${styles['register-page__input']} ${errors.firstName ? styles['register-page__input--invalid'] : ''}`} 
                                            placeholder="Tu nombre" 
                                            value={firstName} 
                                            onChange={e => setFirstName(e.target.value)} 
                                        />
                                        {errors.firstName && <span className={styles['register-page__error']}>{errors.firstName}</span>}
                                    </div>

                                    <div className={styles['register-page__field']}>
                                        <label className={styles['register-page__label']}>Apellidos<span>*</span></label>
                                        <input 
                                            type="text" 
                                            className={`${styles['register-page__input']} ${errors.lastName ? styles['register-page__input--invalid'] : ''}`} 
                                            placeholder="Tus apellidos" 
                                            value={lastName} 
                                            onChange={e => setLastName(e.target.value)} 
                                        />
                                        {errors.lastName && <span className={styles['register-page__error']}>{errors.lastName}</span>}
                                    </div>

                                    <div className={styles['register-page__field']}>
                                        <label className={styles['register-page__label']}>Celular<span>*</span></label>
                                        <div className={styles['register-page__phone-group']}>
                                            <input type="text" className={styles['register-page__phone-prefix']} disabled value="+52"/>
                                            <input 
                                                type="tel" 
                                                className={`${styles['register-page__input']} ${errors.phone ? styles['register-page__input--invalid'] : ''}`} 
                                                placeholder="10 dígitos" 
                                                maxLength={10} 
                                                value={phone} 
                                                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} 
                                            />
                                        </div>
                                        {errors.phone && <span className={styles['register-page__error']}>{errors.phone}</span>}
                                    </div>

                                    <button type="submit" className={styles['register-page__submit-btn']} disabled={loading}>
                                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Unirme a la manada'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default Register;