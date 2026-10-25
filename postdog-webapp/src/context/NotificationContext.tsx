
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AlertProps } from '@mui/material/Alert';
import { AlertSnackbar } from '../components/ui/AlertSnackbarUi/AlertSnackbar';

interface AlertState {
  open: boolean;
  title: string;
  description?: string;
  severity: AlertProps['severity'];
  autoHideDuration?: number;
  }

interface NotificationContextType {
  showNotification: (title: string, description?: string, severity?: AlertProps['severity'], autoHideDuration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    title: '',
    description: '',
    severity: 'success',
    autoHideDuration: 6000,
  });

  const handleClose = () => {
    setAlertState((prevState) => ({ ...prevState, open: false }));
  };

  const showNotification = React.useCallback((
    title: string,
    description: string = '',
    severity: AlertProps['severity'] = 'success',
    autoHideDuration?: number,
  ) => {
    setAlertState({
      open: true,
      title,
      description,
      severity,
      autoHideDuration,
    });
  }, []);

  const contextValue = React.useMemo(() => ({
    showNotification,
  }), [showNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <AlertSnackbar
        open={alertState.open}
        title={alertState.title}
        description={alertState.description}
        severity={alertState.severity}
        autoHideDuration={alertState.autoHideDuration}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};