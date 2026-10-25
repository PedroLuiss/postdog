import React from 'react';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';
import InputUi from '../../ui/Input/InputUi';
import TextareaUi from '../../ui/TextareaUi/TextareaUi';
import ButtonUi from '../../ui/Button/ButtonUi';
import styles from './IndividualNotificationModal.module.scss';
import { useIndividualNotificationModal } from './hooks/useIndividualNotificationModal';
import { NOTIFICATION_ICON_CATEGORIES } from './constant';

export const IndividualNotificationModal = ({ isOpen, onClose, user, userIds }: any) => {
    const {
        formData,
        isLoading,
        handleChange,
        setIcon,
        handleSend
    } = useIndividualNotificationModal({ user, onClose, userIds });

    return (
        <DrawerModalUi
            isOpen={isOpen}
            onClose={onClose}
            title={`Enviar Notificación a ${user?.firstName}`}
            maxWidthLg="32rem"
            footer={
                <div className={styles['notification-modal__footer']}>
                    <ButtonUi variant="light" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </ButtonUi>
                    <ButtonUi variant="primary" onClick={handleSend} isLoading={isLoading}>
                        Enviar Notificación
                    </ButtonUi>
                </div>
            }
        >
            <div className={styles['notification-modal__content']}>
                <InputUi 
                    label="Título" 
                    name="title"
                    placeholder="Ej: Tu cuenta ha sido verificada" 
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    containerClassName={styles['notification-modal__title-container']}
                />
                
                <div className={styles['notification-modal__icons-container']}>
                    <label className={styles['notification-modal__label']}>Icono de la notificación</label>
                    <div className={styles['notification-modal__categories-list']}>
                        {NOTIFICATION_ICON_CATEGORIES.map((category) => (
                            <div key={category.name} className={styles['notification-modal__category-group']}>
                                <h4 className={styles['notification-modal__category-name']}>{category.name}</h4>
                                <div className={styles['notification-modal__icon-grid']}>
                                    {category.icons.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={`${styles['notification-modal__icon-option']} ${formData.icon === item.id ? styles['notification-modal__icon-option--active'] : ''}`}
                                            title={item.name}
                                            disabled={isLoading}
                                            onClick={() => setIcon(item.id)}
                                        >
                                            <item.icon size={20} strokeWidth={1.5} />
                                            <span>{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <TextareaUi 
                    label="Mensaje" 
                    name="message"
                    placeholder="Escribe el mensaje aquí..." 
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
        </DrawerModalUi>
    );
};
