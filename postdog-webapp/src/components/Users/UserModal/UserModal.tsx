import React from 'react';
import styles from './UserModal.module.scss';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';
import InputUi from '../../ui/Input/InputUi';
import ButtonUi from '../../ui/Button/ButtonUi';
import { UserModalProps } from './types/UserModal.types';
import { useUserModalForm } from './hooks/useUserModalForm';
import SelectUi from '../../ui/SelectUi/SelectUi';

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
    const {
        formData,
        errors,
        showErrors,
        isLoading,
        handleChange,
        handleSelectChange,
        handleSubmit
    } = useUserModalForm(isOpen, onClose, onSubmitSuccess);

    const footer = (
        <div className={styles['user-modal__footer']}>
            <ButtonUi variant="light" onClick={onClose} disabled={isLoading}>
                Cancelar
            </ButtonUi>
            <ButtonUi variant="primary" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Usuario'}
            </ButtonUi>
        </div>
    );

    return (
        <DrawerModalUi
            isOpen={isOpen}
            onClose={onClose}
            title="Agregar Nuevo Usuario"
            maxWidthLg="30rem"
            footer={footer}
        >
            <div className={styles['user-modal__form']}>
                <div className={styles['user-modal__row']}>
                    <InputUi
                        label="Nombre*"
                        name="firstName"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={handleChange}
                        showBadge={showErrors ? true : formData.firstName.length > 0}
                        error={showErrors ? errors.firstName : undefined}
                        showMessageError={false}
                    />
                    <InputUi
                        label="Apellidos*"
                        name="lastName"
                        placeholder="Apellidos"
                        value={formData.lastName}
                        onChange={handleChange}
                        showBadge={showErrors ? true : formData.lastName.length > 0}
                        error={showErrors ? errors.lastName : undefined}
                        showMessageError={false}
                    />
                </div>

                <InputUi
                    label="Correo Electrónico*"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    showBadge={showErrors ? true : formData.email.length > 0}
                    error={showErrors ? errors.email : undefined}
                    showMessageError={false}
                />

                <div className={styles['phone-field']}>
                    <label className={styles['phone-field__label']}>Teléfono (10 dígitos)*</label>
                    <div className={styles['phone-field__content']}>
                        <SelectUi 
                            containerClassName={styles['phone-field__select']}
                            options={[]}
                            placeholder="🇲🇽 +52"
                            disabled    
                        />
                        <InputUi 
                            containerClassName={styles['phone-field__input']}
                            value={formData.phone}
                            name="phone"
                            onChange={handleChange}
                            showBadge={showErrors ? true : formData.phone.length > 0}
                            error={showErrors ? errors.phone : undefined}
                            showMessageError={false}
                        />
                    </div>
                </div>

                <SelectUi
                    label="Rol*"
                    name="role_id"
                    placeholder="Seleccionar rol"
                    value={formData.role_id}
                    onChange={handleSelectChange}
                    options={[
                        { label: 'Administrador', value: 'ADMIN' },
                        { label: 'Usuario', value: 'USER' },
                        { label: 'Vendor', value: 'VENDOR' }
                    ]}
                    error={showErrors ? errors.role_id : undefined}
                    showMessageError={false}
                />

                <InputUi
                    label="Contraseña*"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    showBadge={showErrors ? true : (formData?.password?.length || 0) > 0}
                    error={showErrors ? errors.password : undefined}
                    showMessageError={false}
                />
            </div>
        </DrawerModalUi>
    );
};
