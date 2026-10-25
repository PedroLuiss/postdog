import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomAlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  title: string;
  children: React.ReactNode;
  onClose?: () => void; 
  sx?: SxProps<Theme>; 
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ 
    severity, 
    title, 
    children, 
    onClose,
    sx 
}) => {
    const baseStyles: SxProps<Theme> = {
        borderRadius: '8px',
        borderLeft: '5px solid',
        borderColor: `${severity}.main`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        alignItems: 'center',
        padding: '8px 16px',
        '& .MuiAlertTitle-root': {
            marginBottom: 0,
            marginTop: 0,
            fontWeight: 600,
        },
        '& .MuiAlert-icon': {
            fontSize: 24,
            padding: 0,
            marginRight: '12px',
        },
        '& .MuiAlert-message': {
             padding: '8px 0',
        }
    };

    return (
        <Alert
            severity={severity}
            onClose={onClose}
            sx={{ ...baseStyles, ...sx }}
        >
            <AlertTitle>{title}</AlertTitle>
            {children}
        </Alert>
    );
};