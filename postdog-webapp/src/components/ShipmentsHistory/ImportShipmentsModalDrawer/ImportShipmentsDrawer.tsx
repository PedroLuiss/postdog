import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import { X } from 'lucide-react';
import styles from './ImportShipmentsDrawer.module.scss';
import ImportManualSection from './components/ImportManualSection';
import ImportBulkSection from './components/ImportBulkSection';
import { useImportShipments } from '../../../hooks/useImportShipments';
import DrawerModalUi from '../../ui/DrawerUi/DrawerModalUi';

interface ImportShipmentsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImportShipmentsDrawer: React.FC<ImportShipmentsDrawerProps> = ({ isOpen, onClose }) => {

    const { isImporting, handleManualImport, handleBulkImport, isImportingBulk } = useImportShipments(onClose);
    
    const carrierOptions = [
        { label: 'DHL Express', value: 'dhl_express' },
        { label: 'Estafeta Servicio Express', value: 'estafeta_express' },
        { label: 'Fedex Express Saver', value: 'fedex_saver' },
        { label: 'J&T Nacional', value: 'jt_nacional' },
        { label: 'UPS Express', value: 'ups_express' },
        { label: 'Redpack', value: 'redpack' },
        { label: '99 Minutos', value: '99_minutos' },
    ];


    return (
        <DrawerModalUi
            anchor="right"
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="100vw"
            maxWidthLg='42rem'

        >
            <div className={styles['import-drawer']}>
                <header className={styles['import-drawer__header']}>
                    <h2 className={styles['import-drawer__title']}>Importar envíos</h2>
                    <button
                        onClick={onClose}
                        className={styles['import-drawer__close']}
                        aria-label="Cerrar modal"
                    >
                        <X size={18} />
                        <span className={styles['import-drawer__sr-only']}>Close</span>
                    </button>
                </header>

                <div className={styles['import-drawer__body']}>

                    <ImportManualSection 
                        carrierOptions={carrierOptions} 
                        onImport={handleManualImport} 
                        isLoading={isImporting}
                    />

                    <div className={styles['import-drawer__separator']}>
                        <span className={styles['import-drawer__separator-line']}></span>
                        <span className={styles['import-drawer__separator-text']}>ó</span>
                        <span className={styles['import-drawer__separator-line']}></span>
                    </div>

                    <ImportBulkSection 
                        onImport={handleBulkImport} 
                        isLoading={isImportingBulk}
                    />
                </div>
            </div>
        </DrawerModalUi>
    );
};