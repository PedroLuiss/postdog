import logoAuth from "../../../assets/img/logo_auth.png";
import styles from './ResetPassword.module.scss';

import { AuthErrorModal } from '../../../components/AuthErrorModal/AuthErrorModal';
import { PasswordSuccessModal } from '../../../components/auth/PasswordSuccessModal/PasswordSuccessModal';
import { ResetForm } from '../../../components/auth/ResetForm/ResetForm';
import { useResetPassword } from './hooks/useResetPassword';

const ResetPassword = () => {
    const {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        showPassword,
        showConfirmPassword,
        isSuccessOpen,
        isErrorOpen,
        errorMsg,
        errors,
        setErrors,
        loading,
        tokenFromUrl,
        handleSubmit,
        toggleShowPassword,
        toggleShowConfirmPassword,
        closeErrorModal
    } = useResetPassword();

    return (
        <div className={styles['reset-password']}>
            <div className={styles['reset-password__hero']}>
                <div className={styles['reset-password__hero-content']}>
                    <h2 className={styles['reset-password__hero-title']}>Recupera tu acceso</h2>
                    <img src={logoAuth} alt="Postdog mascot" className={styles['reset-password__hero-dog']} />
                </div>
            </div>

            <div className={styles['reset-password__form-side']}>
                <div className={styles['reset-password__form-container']}>

                    {tokenFromUrl ? (
                        <ResetForm
                            password={password}
                            setPassword={setPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showPassword={showPassword}
                            showConfirmPassword={showConfirmPassword}
                            errors={errors}
                            setErrors={setErrors}
                            loading={loading}
                            handleSubmit={handleSubmit}
                            toggleShowPassword={toggleShowPassword}
                            toggleShowConfirmPassword={toggleShowConfirmPassword}
                        />
                    ) : (
                        <div className="text-center">
                            <h1 className={styles['reset-password__invalid-title']}>Token inválido</h1>
                            <p className={styles['reset-password__invalid-text']}>El enlace de recuperación ha expirado o es incorrecto.</p>
                        </div>
                    )}
                </div>
            </div>

            <PasswordSuccessModal isOpen={isSuccessOpen} />

            <AuthErrorModal
                isOpen={isErrorOpen}
                onClose={closeErrorModal}
                description={errorMsg}
            />
        </div>
    );
}

export default ResetPassword;