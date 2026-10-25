import { ArrowRight } from 'lucide-react';

import styles from './Login.module.scss';
import PostDogLogoMascot from "../../assets/Logos/logo_login.png";
import { useLogin } from './hooks/useLogin';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { LoginSuccessModal } from '../../components/LoginForm/LoginSuccessModal';
import { AuthErrorModal } from '../../components/AuthErrorModal/AuthErrorModal';

export const Login = () => {
    const loginProps = useLogin();

    return (
        <div className={styles['login-page']}>
             {loginProps.showSuccessModal && (
                <LoginSuccessModal onConfirm={loginProps.handleConfirmSuccess} />
            )}
            
            <AuthErrorModal 
                isOpen={loginProps.showErrorModal} 
                onClose={() => loginProps.setShowErrorModal(false)} 
                title="Error al iniciar sesión"
                description={loginProps.errorMessage}
            />
            <div className={styles['login-page__hero']}>
                <div className={styles['login-page__hero-content']}>
                    <h1 className={styles['login-page__hero-title']}>
                        Envíos que mueven <span>la cola</span>
                    </h1>
                    <p className={styles['login-page__hero-subtitle']}>
                        Con Postdog, tus paquetes llegan felices
                    </p>
                    <div className={styles['login-page__hero-image-box']}>
                        <img 
                            src={PostDogLogoMascot} 
                            alt="Postdog mascot" 
                            className={styles['login-page__hero-dog']} 
                        />
                    </div>
                </div>
            </div>

            <div className={styles['login-page__form-side']}>
                <div className={styles['login-page__form-container']}>
                    
                    <div className={styles['login-page__nav-link']}>
                        <a onClick={() => loginProps.navigate("/register")}>
                            ¿Aún no eres parte de la manada? <span>Regístrate</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className={styles['login-page__header']}>
                        <h2 className={styles['login-page__header-title']}>
                            Inicia Sesión en <span>Postdog</span>
                        </h2>
                        <p className={styles['login-page__header-subtitle']}>
                            Bienvenido de vuelta a la manada
                        </p>
                    </div>
                   <LoginForm styles={styles} {...loginProps} />
                </div>
            </div>
        </div>
    );
};