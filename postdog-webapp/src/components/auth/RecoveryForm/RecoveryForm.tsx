import React from 'react';
import { CircularProgress } from '@mui/material';
import styles from './RecoveryForm.module.scss';
import { RecoveryFormProps } from './types';

export const RecoveryForm: React.FC<RecoveryFormProps> = ({
    email,
    setEmail,
    loading,
    errors,
    handleSubmit,
    navigate
}) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className={styles['recovery-form__header']}>
                <h1 className={styles['recovery-form__title']}>¿Olvidaste tu contraseña?</h1>
                <p className={styles['recovery-form__subtitle']}>No te preocupes, te ayudamos a recuperarla.</p>
            </div>

            <form className={styles['recovery-form__form']} onSubmit={handleSubmit}>
                <div className={styles['recovery-form__field']}>
                    <label className={styles['recovery-form__label']}>
                        Correo electrónico<span>*</span>
                    </label>
                    <input 
                        type="email" 
                        className={`${styles['recovery-form__input']} ${errors.email ? styles['recovery-form__input--invalid'] : ''}`}
                        placeholder="tu@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {errors.email && <span className={styles['recovery-form__error']}>{errors.email}</span>}
                </div>

                <button 
                    type="submit" 
                    className={styles['recovery-form__submit-btn']}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Recuperar contraseña'}
                </button>

                <div className={styles['recovery-form__footer']}>
                    <a onClick={() => navigate("/login")} className={styles['recovery-form__link']}>
                        Iniciar sesión
                    </a>
                </div>
            </form>
        </div>
    );
};
