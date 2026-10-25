import React, { useCallback } from 'react';
import styles from './ActionButton.module.scss';
import PetsIcon from '@mui/icons-material/Pets';
import { Quote } from '../../../../types';
import { useQuotes } from '../../../../hooks/useQuotes';
import { useShippingQuoteDrawer } from '../../../../context';

interface MakeShipmentActionsProps {
    quote: Quote;
}

export const MakeShipmentActions: React.FC<MakeShipmentActionsProps> = ({ quote }) => {
      const { openDrawer } = useShippingQuoteDrawer();
    
    const { saveSelectedQuote, isSavingSelectedQuote } = useQuotes();
    
    const buttonText = isSavingSelectedQuote ? 'Enviando...' : 'Realizar envío';
    const isDisabled = isSavingSelectedQuote;

    const handleSelect = useCallback(async () => {
        if (!isDisabled) {
            await saveSelectedQuote(quote);
            openDrawer();
        }
    }, [isDisabled, quote, saveSelectedQuote]); 

    return (
        <button
            className={styles['action-button']}
            onClick={handleSelect} 
            disabled={isDisabled}
        >
            {buttonText} <PetsIcon fontSize="small" />
        </button>
        
    );
};