import React from 'react';
import { X } from 'lucide-react';
import styles from './DownloadGuidesModal.module.scss';
import ButtonUi from '../../ui/Button/ButtonUi';
import LoadingUi from '../../ui/LoadingUi';
import { RadioUi } from '../../ui/SelectionUi'; // Importamos el componente global
import { useDownloadGuidesShipment } from '../../../hooks/useDownloadGuidesShipment';

interface DownloadGuidesModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedIds: string[];
}

export const DownloadGuidesModal: React.FC<DownloadGuidesModalProps> = ({
    isOpen,
    onClose,
    selectedIds,
}) => {
    const {
        downloadType,
        isDownloading,
        handleConfirmDownload,
        changeDownloadType
    } = useDownloadGuidesShipment({ selectedIds, onClose });

    if (!isOpen) return null;

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal']} role="dialog">
                {isDownloading && <LoadingUi bg="rgba(255, 255, 255, 0.7)" size={40} />}

                <button
                    className={styles['modal__close-corner']}
                    onClick={onClose}
                    disabled={isDownloading}
                >
                    <X size={18} />
                </button>

                <div className={styles['modal__header']}>
                    <h2 className={styles['modal__title']}>Descargar guías</h2>
                    <p className={styles['modal__subtitle']}>
                        Selecciona cómo quieres descargar las {selectedIds.length} guías seleccionadas
                    </p>
                </div>

                <div className={styles['modal__body']}>
                    <div className={styles['radio-group']}>

                        <RadioUi
                            name="download-type"
                            checked={downloadType === 'individual'}
                            onChange={() => changeDownloadType('individual')}
                            disabled={isDownloading}
                            className={`${styles['modal__radio-option']}`}
                            label={
                                <div className={styles['radio-item__content']}>
                                    <span className={styles['radio-item__label']}>Descargar cada guía individualmente</span>
                                    <span className={styles['radio-item__description']}>Se descargará cada guía en un archivo separado</span>
                                </div>
                            }
                        />

                        <RadioUi
                            name="download-type"
                            checked={downloadType === 'agrupado'}
                            onChange={() => changeDownloadType('agrupado')}
                            disabled={isDownloading}
                            className={`${styles['modal__radio-option']}`}
                            label={
                                <div className={styles['radio-item__content']}>
                                    <span className={styles['radio-item__label']}>Descargar todas las guías en un solo archivo</span>
                                    <span className={styles['radio-item__description']}>Todas las guías se agruparán en un solo PDF</span>
                                </div>
                            }
                        />

                    </div>
                </div>

                <div className={styles['modal__footer']}>
                    <ButtonUi variant="light" className={styles['modal__btn-cancel']} onClick={onClose} disabled={isDownloading}>
                        Cancelar
                    </ButtonUi>
                    <ButtonUi
                        variant="primary"
                        onClick={handleConfirmDownload}
                        className={styles['modal__btn-download']}
                        disabled={isDownloading || !downloadType}
                    >
                        {isDownloading ? 'Generando...' : 'Descargar'}
                    </ButtonUi>
                </div>
            </div>
        </div>
    );
};