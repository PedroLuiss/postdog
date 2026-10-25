import React from 'react';
import { X } from 'lucide-react';
import styles from './GlobalAlertsModal.module.scss';
import InputUi from '../../ui/Input/InputUi';
import SelectUi from '../../ui/SelectUi/SelectUi';
import SwitchUi from '../../ui/SwitchUi/SwitchUi';
import ButtonUi from '../../ui/Button/ButtonUi';
import { AlertDialogUi } from '../../ui/AlertDialogUi/AlertDialogUi';
import { useGlobalAlertsModalForm } from './hooks/useGlobalAlertsModalForm';
import TextareaUi from '../../ui/TextareaUi/TextareaUi';
import { ICON_CATEGORIES } from './constant';
import { GlobalAlertsModalProps } from './types';


export const GlobalAlertsModal: React.FC<GlobalAlertsModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
    const { 
        formData, 
        isLoading, 
        showErrors, 
        errors, 
        hasBeenSent,
        handleChange, 
        handleSelectChange, 
        togglePinned, 
        setIcon, 
        isFormValid,
        handleSubmit 
    } = useGlobalAlertsModalForm({ initialData, isOpen, onClose, onSubmit });

    const isFormDisabled = isLoading || hasBeenSent;

    return (
        <AlertDialogUi
            classDialog={styles['alert-drawer__container']}
            classDialogContent={styles['alert-drawer__content']}
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? (hasBeenSent ? 'Detalles de Alerta' : 'Editar Alerta') : 'Nueva alerta'}
            showFooter={false}
        >
            <div className={styles['alert-drawer__form']}>
                <InputUi
                    containerClassName={styles['alert-drawer__input-container']}
                    label="Título"
                    name="title"
                    placeholder="Ej: Retraso en paquetería"
                    value={formData.title}
                    onChange={handleChange}
                    error={showErrors ? errors.title : undefined}
                    showBadge={false}
                    isValid={formData.title.length > 0}
                    showMessageError={false}
                    disabled={isFormDisabled}
                />

                <div className={styles['alert-drawer__icons-container']}>
                    <label className={styles['alert-drawer__label']}>Icono</label>
                    
                    <div className={styles['alert-drawer__categories-list']}>
                        {ICON_CATEGORIES.map((category) => (
                            <div key={category.name} className={styles['alert-drawer__category-group']}>
                                <div className={styles['alert-drawer__icon-grid']}>
                                    {category.icons.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={`${styles['alert-drawer__icon-option']} ${formData.icon === item.id ? styles['alert-drawer__icon-option--active'] : ''}`}
                                            title={item.name}
                                            disabled={isFormDisabled}
                                            onClick={() => setIcon(item.id)}
                                        >
                                            <item.icon size={20} strokeWidth={2} />
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
                    placeholder="Describe el aviso para todos los usuarios"
                    value={formData.message}
                    onChange={handleChange}
                    error={showErrors ? errors.message : undefined}
                    showBadge={false}
                    isValid={formData.message.length > 0}
                    showMessageError={false}
                    rows={3}
                    disabled={isFormDisabled}
                    containerClassName={styles['alert-drawer__input-container__message']}
                />

                <div className={styles['alert-drawer__input-container']}>
                    <InputUi
                        label="Fecha de envío"
                        name="sendDate"
                        type="datetime-local"
                        containerClassName={styles['alert-drawer__input-container']}
                        value={formData.sendDate}
                        onChange={handleChange}
                        error={showErrors ? errors.sendDate : undefined}
                        showBadge={false}
                        isValid={formData.sendDate.length > 0}
                        showMessageError={false}
                        readOnly={!!initialData}
                        disabled={isFormDisabled}
                    />
                    <p className={styles['alert-drawer__helper-text']}>
                        Para envío inmediato, programa unos minutos después de la hora actual.
                    </p>
                </div>

                <SelectUi
                    label="Prioridad"
                    containerClassName={styles['alert-drawer__input-container']}
                    name="priority"
                    value={formData.priority}
                    onChange={handleSelectChange}
                    disabled={isFormDisabled}
                    options={[
                        { value: 'LOW', label: 'Baja' },
                        { value: 'MEDIUM', label: 'Media' },
                        { value: 'HIGH', label: 'Alta' },
                    ]}
                />

                <div className={styles['alert-drawer__switch-container']}>
                    <div className={styles['alert-drawer__switch-container__info']}>
                        <p className={styles['alert-drawer__switch-container__info__label']}>Fijar alerta</p>
                        <p className={styles['alert-drawer__switch-container__info__description']}>Aparece siempre en la parte superior. Máximo 3 fijadas.</p>
                    </div>
                    <SwitchUi
                        checked={formData.isPinned}
                        onChange={togglePinned}
                        disabled={isFormDisabled}
                    />
                </div>

                <div className={styles['alert-drawer__footer-btns']}>
                    <ButtonUi variant="light" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </ButtonUi>
                    {!hasBeenSent && (
                        <ButtonUi 
                            className={styles['alert-drawer__btn-primary']}
                            onClick={handleSubmit} 
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Crear alerta')}
                        </ButtonUi>
                    )}
                </div>
            </div>

            <button
                type="button"
                className={styles['alert-drawer__btn-close']}
                onClick={onClose}
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </AlertDialogUi>
    );
};