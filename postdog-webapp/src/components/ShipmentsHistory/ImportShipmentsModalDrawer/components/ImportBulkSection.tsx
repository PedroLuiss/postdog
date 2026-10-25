import React, { useCallback, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import styles from '../ImportShipmentsDrawer.module.scss';
import ButtonUi from '../../../ui/Button/ButtonUi';

interface ImportBulkSectionProps {
    onImport: (file: File) => void;
    isLoading?: boolean;
}

const ImportBulkSection: React.FC<ImportBulkSectionProps> = ({ onImport, isLoading }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleConfirm = useCallback(() => {
        if (file) onImport(file);
    }, [file, onImport]);

    return (
        <section className={styles['import-card']}>
            <div className={styles['import-card__bulk-header']}>
                <p className={styles['import-card__main-text']}>
                    Si prefieres cargar varios envíos al mismo tiempo, puedes descargar y llenar una plantilla.
                </p>
                <div className={styles['import-card__template-group']}>
                    <ButtonUi variant="light" icon={<Download size={16} />} className={styles['import-card__template-btn']}>
                        Descargar XLSX
                    </ButtonUi>
                    <ButtonUi variant="light" icon={<Download size={16} />} className={styles['import-card__template-btn']}>
                        Descargar CSV
                    </ButtonUi>
                </div>
            </div>

            <div className={styles['import-card__guide']}>
                <p className={styles['import-card__guide-title']}>Guía para completar y subir tu archivo.</p>
                <p className={styles['import-card__guide-subtitle']}>Antes de subir el archivo, asegúrate de considerar lo siguiente:</p>
                <ul className={styles['import-card__guide-list']}>
                    <li>Ingresa el número de rastreo y la paquetería correspondiente para cada envío que desees registrar.</li>
                    <li>No deben existir números de rastreo repetidos y que cada uno pertenezca a una paquetería válida.</li>
                    <li>Verifica que tu archivo no supere los 5 MB y contenga máximo 500 envíos.</li>
                </ul>
            </div>

            <div className={`
                ${styles['import-card__dropzone']} 
                ${file ? styles['import-card__dropzone--uploaded'] : ''}
            `}>
                <Upload 
                    size={48} 
                    className={styles['import-card__dropzone-icon']} 
                />
                <p className={styles['import-card__dropzone-text']}>
                    {file ? (
                        <span className={styles['import-card__dropzone-filename']}>
                            {file.name}
                        </span>
                    ) : (
                        "Selecciona o arrastra aquí un archivo en formato XLSX o CSV"
                    )}
                </p>
                
                <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    id="bulk-file-upload" 
                    className={styles['import-card__file-input']} 
                    onChange={handleFileChange}
                />
                
                <label htmlFor="bulk-file-upload" className={styles['import-card__file-label']}>
                    {file ? "Cambiar archivo" : "Seleccionar archivo"}
                </label>
            </div>

             <ButtonUi 
                variant="primary" 
                disabled={!file || isLoading} 
                className={styles['import-card__submit-bulk-shipments']}
                fullWidth 
                onClick={handleConfirm}
            >
                {isLoading ? 'Importando...' : 'Importar envíos'}
            </ButtonUi>
        </section>
    );
};

export default ImportBulkSection;