import React from 'react';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';
import ModalUi from '../../ui/ModalUi/ModalUi';
import InputUi from '../../ui/Input/InputUi';
import ButtonUi from '../../ui/Button/ButtonUi';
import { Upload } from 'lucide-react';
import styles from './AccountDetailsModal.module.scss';

import { useAccountDetailsModal } from './hooks/useAccountDetailsModal';
import { UserUI } from '../../../types';

interface AccountDetailsModalProps {
    isOpen: boolean;
    onClose: any;
    user: UserUI;
    isVendor?: boolean;
    onUpdateSuccess?: (user: any) => void;
}

export const AccountDetailsModal = ({ isOpen, onClose, user, isVendor = false, onUpdateSuccess }: AccountDetailsModalProps) => {
    const {
        formData,
        files,
        errors,
        showErrors,
        isLoading,
        handleChange,
        handleFileUpload,
        handleDownload,
        handleSave
    } = useAccountDetailsModal(user, onClose, onUpdateSuccess);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [previewDoc, setPreviewDoc] = React.useState<{ name: string, url: string } | null>(null);

    const isImage = (fileName: string) => {
        return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    };


    return (
        <>
            <DrawerModalUi
                isOpen={isOpen}
                onClose={onClose}
                title={isVendor ? "Detalles de Cuenta" : "Modificar Cuenta"}
                maxWidthLg="35rem"
                footer={
                    <div className={styles['account-modal__footer']}>
                        <ButtonUi variant="light" onClick={onClose}>
                            {isVendor ? "Cerrar" : "Cancelar"}
                        </ButtonUi>
                        {!isVendor && (
                            <ButtonUi
                                variant="primary"
                                onClick={handleSave}
                                isLoading={isLoading}
                            >
                                Guardar Cambios
                            </ButtonUi>
                        )}
                    </div>
                }
            >
                <div className={styles['account-modal__content']}>
                    <InputUi
                        label="Correo"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={showErrors ? errors.email : ''}
                        showMessageError={false}
                        readOnly={true}
                    />
                    <div className={styles['account-modal__row']}>
                        <InputUi
                            label="Nombre"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={showErrors ? errors.firstName : ''}
                            showMessageError={false}
                            disabled={isVendor}
                            showBadge={true}
                        />
                        <InputUi
                            label="Apellidos"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={showErrors ? errors.lastName : ''}
                            showMessageError={false}
                            disabled={isVendor}
                            showBadge={true}
                        />
                    </div>
                    <InputUi
                        label="Teléfono (10 dígitos)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        error={showErrors ? errors.phone : ''}
                        showMessageError={false}
                        showBadge={true}
                        disabled={isVendor}
                    />

                    <div className={styles['account-modal__row']}>
                        <InputUi
                            label="CURP (18 caract.)"
                            name="curp"
                            value={formData.curp}
                            onChange={handleChange}
                            maxLength={18}
                            error={showErrors ? errors.curp : ''}
                            showMessageError={false}
                            showBadge={true}
                            disabled={isVendor}
                        />
                        <InputUi
                            label="INE (9 caract.)"
                            name="ine"
                            value={formData.ine}
                            onChange={handleChange}
                            maxLength={9}
                            error={showErrors ? errors.ine : ''}
                            showMessageError={false}
                            showBadge={true}
                            disabled={isVendor}
                        />
                    </div>

                    <div>
                        <label className={styles['account-modal__docs-label']}>
                            Documentos de Verificación
                        </label>
                        <div className={styles['account-modal__docs-section']}>
                            {files.map((file, i) => (
                                <div key={i} className={styles['account-modal__file-item']}>
                                    <span className={styles['account-modal__file-name']}>{file.name}</span>
                                    <div className={styles['account-modal__file-actions']}>
                                        <button
                                            className={styles['account-modal__view-btn']}
                                            onClick={() => setPreviewDoc({ name: file.name, url: file.url })}
                                        >
                                            Ver Documento
                                        </button>
                                        <button
                                            className={styles['account-modal__download-btn']}
                                            onClick={() => handleDownload(file)}
                                        >
                                            Descargar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {!isVendor && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        multiple
                                        onChange={handleFileUpload}
                                    />

                                    <button
                                        className={`${styles['account-modal__upload-btn']} ${showErrors && errors.files ? styles['account-modal__upload-btn--error'] : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={18} /> Subir Documento
                                    </button>
                                </>
                            )}
                            {showErrors && errors.files && (
                                <span className={styles['account-modal__error-text']}>{errors.files}</span>
                            )}
                        </div>
                    </div>
                </div>
            </DrawerModalUi>

            {previewDoc && (
                <ModalUi
                    isOpen={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    maxWidth="xl"
                    className={styles['account-modal__preview-modal']}
                >
                    <div className={styles['account-modal__preview-container']}>
                        <header className={styles['account-modal__preview-header']}>
                            <h3 className={styles['account-modal__preview-title']}>{previewDoc.name}</h3>
                        </header>
                        <div className={styles['account-modal__preview-body']}>
                            {isImage(previewDoc.name) ? (
                                <img
                                    src={previewDoc.url}
                                    alt={previewDoc.name}
                                    className={styles['account-modal__preview-img']}
                                />
                            ) : (
                                <iframe
                                    src={previewDoc.url}
                                    title={previewDoc.name}
                                    className={styles['account-modal__preview-iframe']}
                                />
                            )}
                        </div>
                    </div>
                </ModalUi>
            )}
        </>
    )
};

