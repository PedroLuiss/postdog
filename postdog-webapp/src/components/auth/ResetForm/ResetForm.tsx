import React from 'react';
import { CircularProgress } from '@mui/material';
import { Eye, EyeOff, CircleAlert } from 'lucide-react';
import styles from './ResetForm.module.scss';
import { ResetFormProps } from './types';

export const ResetForm: React.FC<ResetFormProps> = ({
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    errors,
    setErrors,
    loading,
    handleSubmit,
    toggleShowPassword,
    toggleShowConfirmPassword
}) => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className={styles['reset-form__header']}>
                <h1 className={styles['reset-form__title']}>Nueva contraseña</h1>
                <p className={styles['reset-form__subtitle']}>Ingresa tu nueva contraseña para recuperar tu cuenta.</p>
            </div>

            <div className={styles['reset-form__alert']}>
                <div className={styles['reset-form__alert-content']}>
                    <CircleAlert size={20} className={styles['reset-form__alert-icon']} />
                    <p className={styles['reset-form__alert-text']}>
                        <strong>Contraseña aprobada por Postdog:</strong> 15 caracteres, o mínimo 8 con un número y una minúscula.
                    </p>
                </div>
            </div>

            <form className={styles['reset-form__form']} onSubmit={handleSubmit}>
                <div className={styles['reset-form__field']}>
                    <label className={styles['reset-form__label']}>Nueva contraseña<span>*</span></label>
                    <div className={styles['reset-form__input-wrapper']}>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            className={`${styles['reset-form__input']} ${errors.password ? styles['reset-form__input--invalid'] : ''}`}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setErrors(prev => ({ ...prev, password: '' }));
                            }}
                        />
                        <button 
                            type="button" 
                            className={styles['reset-form__password-toggle']}
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && <span className={styles['reset-form__error']}>{errors.password}</span>}
                </div>

                <div className={styles['reset-form__field']}>
                    <label className={styles['reset-form__label']}>Confirmar nueva contraseña<span>*</span></label>
                    <div className={styles['reset-form__input-wrapper']}>
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`${styles['reset-form__input']} ${errors.confirmPassword ? styles['reset-form__input--invalid'] : ''}`}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                        />
                        <button 
                            type="button" 
                            className={styles['reset-form__password-toggle']}
                            onClick={toggleShowConfirmPassword}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className={styles['reset-form__error']}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className={styles['reset-form__submit-btn']} disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
                </button>
            </form>
        </div>
    );
};