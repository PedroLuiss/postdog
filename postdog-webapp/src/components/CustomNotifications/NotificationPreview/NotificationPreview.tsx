import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './NotificationPreview.module.scss';
import { NotificationPreviewProps } from './types';
import { getContrastColor } from '../../../utils/colorUtils';

export const NotificationPreview: React.FC<NotificationPreviewProps> = React.memo(({ 
    formData, 
    previewUrl, 
    previewHtml, 
    loading 
}) => {

   const processedHtml = useMemo(() => {
        if (!previewHtml) return null;

        const parser = new DOMParser();
        const doc = parser.parseFromString(previewHtml, 'text/html');

        const header = doc.querySelector('.front-style-header') as HTMLElement;
        if (header) {
            header.style.backgroundColor = formData.primaryColor;
            header.style.justifyContent = 'center';
            header.style.color = formData.buttonTextColor || getContrastColor(formData.primaryColor);
        }

        const logo = doc.querySelector('.front-style-logo') as HTMLImageElement;
        if (logo) {
            const currentLogo = previewUrl || formData.logoUrl;
            if (currentLogo) {
                logo.src = currentLogo;
            }
        }

        const button = doc.querySelector('.front-style-button') as HTMLElement;
        if (button) {
            button.style.backgroundColor = formData.primaryColor;
            button.style.color = formData.buttonTextColor || getContrastColor(formData.primaryColor);
        }

        const unsubscribeLink = doc.querySelector('.front-style-unsubscribe') as HTMLElement;
        if (unsubscribeLink) {
            unsubscribeLink.style.color = formData.secondaryColor;
        }

        const storeNameElement = doc.querySelector('.front-style-store-name');
        if (storeNameElement) {
            storeNameElement.textContent = formData.storeName;
        }

        return doc.body.innerHTML;

    }, [previewHtml, formData.primaryColor, formData.secondaryColor, formData.logoUrl, previewUrl, formData.storeName]);

    return (
        <section className={styles['notifications__card']}>
            <div className={styles['notifications__card-header']}>
                <h2 className={styles['notifications__card-title']}>Vista previa (el mensaje cambia de acuerdo al estatus)</h2>
            </div>

            <div className={styles['notifications__preview-container']}>
                {loading && (
                    <div className={styles['notifications__preview-loader']}>
                        <Loader2 className={styles['spinner']} size={32} />
                    </div>
                )}
                <div className={styles['email-preview']}>
                    {processedHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                    ) : (
                        <>
                            <header className={styles['email-preview__banner']} style={{ backgroundColor: formData.primaryColor, color: formData.buttonTextColor || getContrastColor(formData.primaryColor) }}>
                                <span className={styles['email-preview__logo-placeholder']}>
                                    {previewUrl || formData.logoUrl ? (
                                        <img src={previewUrl || formData.logoUrl} alt="Logo" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        formData.storeName ? formData.storeName.toUpperCase() : 'MI TIENDA'
                                    )}
                                </span>
                            </header>

                            <div className={styles['email-preview__content']}>
                                <p>Hola, <strong>Isaac Cortés</strong> 👋</p>
                                <p>¡Tu pedido <strong>#12345</strong> ha sido registrado exitosamente!</p>
                                <p>Estamos preparando tu envío con mucho cuidado. En breve recibirás una actualización cuando sea recolectado por la paquetería.</p>
                                
                                <div className={styles['email-preview__divider']}>
                                    ━━━━━━━━━━━━━━━━━━━━━━━<br/>
                                    📦 DETALLES DE TU ENVÍO<br/>
                                    ━━━━━━━━━━━━━━━━━━━━━━━
                                </div>

                                <div className={styles['email-preview__data']}>
                                    <p>Número de guía: <strong>PDG-778122</strong></p>
                                    <p>Paquetería: <strong>DHL Express</strong></p>
                                    <p>Origen: <strong>CDMX, México</strong></p>
                                </div>

                                <div className={styles['email-preview__divider']}>━━━━━━━━━━━━━━━━━━━━━━━</div>

                                <div className={styles['email-preview__footer-info']}>
                                    <p>¿Necesitas ayuda?</p>
                                    <p>📞 {formData.supportPhone || '(000) 000-0000'}</p>
                                    <p>✉️ {formData.supportEmail || 'soporte@tienda.com'}</p>
                                    <br/>
                                    <p>Visita tu tienda: <span style={{ color: formData.secondaryColor }}>{formData.storeUrl || 'www.mitienda.com'}</span></p>
                                    <p>Saludos,<br/>Equipo de {formData.storeName || 'Mi Tienda'}</p>
                                </div>
                            </div>

                            <footer className={styles['email-preview__disclaimer']}>
                                <p>Este es un mensaje automático, por favor no respondas este correo.</p>
                                <p>¿No deseas recibir notificaciones? <span className={styles['email-preview__link']} style={{ color: formData.secondaryColor }}>Cancelar suscripción</span></p>
                            </footer>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}, (prevProps, nextProps) => {
    if (nextProps.previewHtml) {
        return (
            prevProps.previewHtml === nextProps.previewHtml &&
            prevProps.previewUrl === nextProps.previewUrl &&
            prevProps.loading === nextProps.loading &&
            prevProps.formData.primaryColor === nextProps.formData.primaryColor &&
            prevProps.formData.secondaryColor === nextProps.formData.secondaryColor &&
            prevProps.formData.storeName === nextProps.formData.storeName
        );
    }

    return false;
});
