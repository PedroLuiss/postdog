import React from 'react';
import { MessageCircle } from 'lucide-react';
import styles from './styles/HelpScreen.module.scss';
import { useHelpScreen } from './hooks/useHelpScreen';
import SelectUi from '../ui/SelectUi/SelectUi';

export const HelpScreen: React.FC = () => {
    const {
        formState,
        isSubmitting,
        handleTopicChange,
        handleDescriptionChange,
        handleSubmit,
        handleWhatsApp,
        HELP_TOPICS,
    } = useHelpScreen();

    return (
        <div className={styles['help-center-wrapper']}>
            <div className={styles['help-header']}>
                <p className={styles['support-text']}>
                    Si necesitas ayuda general o soporte adicional, escríbenos a:{' '}
                    <a
                        href="mailto:atencion@postdog.com.mx"
                        className={styles['support-link']}
                    >
                        atencion@postdog.com.mx
                    </a>
                </p>

                <div className={styles['contact-actions']}>
                    <span className={styles['support-text']}>
                        También puedes escribirnos por WhatsApp:
                    </span>
                    <button
                        type="button"
                        className={styles['whatsapp-button']}
                        onClick={handleWhatsApp}
                    >
                        <MessageCircle />
                        Contactar por WhatsApp
                    </button>
                </div>
            </div>

            <div className={styles['support-form-card']}>
                <SelectUi
                    label="Tema"
                    placeholder="Selecciona una opción"
                    options={HELP_TOPICS}
                    value={formState.topic}
                    onChange={({ target: { value } }) => handleTopicChange(String(value))}
                    disabled={isSubmitting}
                    className={styles['help-select-trigger']}
                    containerClassName={styles['help-select-container']}
                />

                <div className={styles['form-group']}>
                    <label htmlFor="help-description">Describe la situación</label>
                    <textarea
                        id="help-description"
                        className={styles['form-textarea']}
                        placeholder="Ingresar texto..."
                        value={formState.description}
                        onChange={handleDescriptionChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles['form-footer']}>
                    <button
                        type="button"
                        className={styles['submit-button']}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};
