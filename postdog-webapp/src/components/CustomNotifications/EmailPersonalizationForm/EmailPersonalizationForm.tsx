import React, { useRef } from 'react';
import styles from './EmailPersonalizationForm.module.scss';
import { Upload, X } from 'lucide-react';
import InputUi from '../../ui/Input/InputUi';
import { EmailPersonalizationFormProps } from './types';

export const EmailPersonalizationForm: React.FC<EmailPersonalizationFormProps> = React.memo(({ 
    formData, 
    handleInputChange, 
    handleFileChange, 
    removeFile, 
    logoFile 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    return (
        <section className={styles['notifications__card']}>
            <div className={styles['notifications__card-header']}>
                <h2 className={styles['notifications__card-title']}>Personalización de correo electrónico</h2>
            </div>

            <div className={styles['notifications__form-body']}>
                <InputUi 
                    label="Nombre de tu tienda"
                    name="storeName"
                    containerClassName={styles['notifications__input']}
                    value={formData.storeName}
                    onChange={handleInputChange}
                />
                

                <div className={styles['notifications__field-group']}>
                    <label className={styles['notifications__label']}>Logotipo</label>
                    <div 
                        className={`${styles['notifications__dropzone']} ${logoFile ? styles['notifications__dropzone--loaded'] : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            hidden 
                            onChange={onFileSelect} 
                            accept="image/*"
                        />

                        {logoFile && (
                            <button 
                                className={styles['notifications__dropzone-remove']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                title="Quitar imagen"
                            >
                                <X size={16} />
                            </button>
                        )}

                        {logoFile ? (
                            <div className={styles['notifications__dropzone-header']}>
                                <Upload size={24} className={styles['notifications__dropzone-icon--loaded']} />
                                <div className={styles['notifications__dropzone-text--filename']}>
                                    {logoFile.name}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload size={32} className={styles['notifications__dropzone-icon']} />
                                <p className={styles['notifications__dropzone-text']}>Sube tu logotipo</p>
                                <p className={styles['notifications__dropzone-subtext']}>o arrastra y suelta</p>
                                <p className={styles['notifications__dropzone-info']}>.jpeg o .png (máx. 1425x800px) 200KB</p>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles['notifications__colors']}>
                    <div className={styles['notifications__color-item']}>
                        <label className={styles['notifications__label'] + ' ' + styles['notifications__label--color'] } >Color principal</label>
                        <div className={styles['notifications__color-input-wrapper']}>
                            <input 
                                key={formData.primaryColor}
                                type="color" 
                                name="primaryColor"
                                defaultValue={formData.primaryColor || '#000000'}
                                onBlur={handleInputChange}
                                className={styles['notifications__color-picker']}
                            />
                            <InputUi 
                                name="primaryColor"
                                value={formData.primaryColor}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles['notifications__color-item']}>
                        <label className={styles['notifications__label' ] + ' ' + styles['notifications__label--color'] }>Color secundario</label>
                        <div className={styles['notifications__color-input-wrapper']}>
                            <input 
                                key={formData.secondaryColor}
                                type="color" 
                                name="secondaryColor"
                                defaultValue={formData.secondaryColor || '#DC2626'}
                                onBlur={handleInputChange}
                                className={styles['notifications__color-picker']}
                            />
                            <InputUi 
                                name="secondaryColor"
                                value={formData.secondaryColor}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});
