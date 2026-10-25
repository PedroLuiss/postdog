import React from 'react';
import { CircularProgress } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleIcon } from '../ui/Icon/GoogleIcon';
import { LoginFormProps } from './types';

export const LoginForm: React.FC<LoginFormProps> = ({
    styles,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    errors,
    loading,
    handleLogin,
    handleLoginFirebase,
    navigate
}) => {
    return (
        <form className={styles['login-page__form']} onSubmit={handleLogin}>
            
            <div className={styles['login-page__field']}>
                <label className={styles['login-page__label']}>
                    Correo electrónico<span>*</span>
                </label>
                <input
                    type="email"
                    className={`${styles['login-page__input']} ${errors.email ? styles['login-page__input--invalid'] : ''}`}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className={styles['login-page__error']}>{errors.email}</span>}
            </div>

            <div className={styles['login-page__field']}>
                <label className={styles['login-page__label']}>
                    Contraseña<span>*</span>
                </label>
                <div className={styles['login-page__input-wrapper']}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`${styles['login-page__input']} ${errors.password ? styles['login-page__input--invalid'] : ''}`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button" 
                        className={styles['login-page__password-toggle']}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && <span className={styles['login-page__error']}>{errors.password}</span>}
                
                <div className={styles['login-page__forgot-password']}>
                    <a onClick={() => navigate("/recovery-password")}>
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>

            <button 
                type="submit" 
                className={styles['login-page__submit-btn']}
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Entrar a la casita'}
            </button>

            <div className={styles['login-page__divider']}>
                <span><i>o</i></span>
            </div>

            <button 
                type="button" 
                className={styles['login-page__google-btn']}
                onClick={handleLoginFirebase}
                disabled={loading}
            >
                <GoogleIcon className={styles['login-page__google-btn__icon']} />
                <span className={styles['login-page__google-btn__text']}>Continuar con Google</span>
            </button>

            <div className={styles['login-page__footer-mobile']}>
                <a onClick={() => navigate("/register")}>
                    ¿Aún no eres parte de la manada? <span>Regístrate</span>
                </a>
            </div>
        </form>
    );
};