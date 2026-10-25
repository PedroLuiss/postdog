import styles from './RecoveryPassword.module.scss';
import { RecoverySuccess, ResendEmailForm, RecoveryForm } from '../../../components/auth';

import { AuthErrorModal } from '../../../components/AuthErrorModal/AuthErrorModal';
import { useRecoveryPassword } from './hooks/useRecoveryPassword';

const RecoveryPassword = () => {
    const {
        email, setEmail,
        loading,
        errors,
        step, setStep,
        showErrorModal,
        errorMsg,
        handleSubmit,
        handleCloseErrorModal,
        navigate
    } = useRecoveryPassword();

    return (
        <div className={styles['recovery-page']}>
            
            <div className={styles['recovery-page__hero']}>
                <div className={styles['recovery-page__hero-content']}>
                    <h2 className={styles['recovery-page__hero-title']}>
                        Recupera tu acceso
                    </h2>
                    <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695f27d3a1df7c2775fd7a0f/b4a1a26a0_dog_drag_red.png" 
                        alt="Postdog mascot" 
                        className={styles['recovery-page__hero-dog']} 
                    />
                </div>
            </div>

            <div className={styles['recovery-page__form-side']}>
                <div className={styles['recovery-page__form-container']}>
                    
                      {step === "form" && (
                        <RecoveryForm 
                            email={email}
                            setEmail={setEmail}
                            loading={loading}
                            errors={errors}
                            handleSubmit={handleSubmit}
                            navigate={navigate}
                        />
                    )}
                        {step === "success" && (
                            <RecoverySuccess 
                                onResend={() => setStep("resend")} 
                                onBackToLogin={() => navigate("/login")} 
                            />
                        )}

                        {step === "resend" && (
                            <ResendEmailForm 
                                email={email}
                                onEmailChange={setEmail}
                                onSubmit={handleSubmit}
                                onBack={() => setStep("form")}
                                loading={loading}
                            />
                        )}
                </div>
            </div>

            <AuthErrorModal 
                isOpen={showErrorModal} 
                onClose={handleCloseErrorModal}
                description={errorMsg}
            />
        </div>
    );
}

export default RecoveryPassword;