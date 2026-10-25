import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from 'react';
import { Shipment } from '../types';
import { getFromStorage, saveToStorage } from '../utils/storage.utils';

interface ShippingQuoteDrawerContextType {
  isOpen: boolean;
  isDrawerOpenEditOrder: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  closeDrawerEditOrde: () => void;
  openDrawerEditOrde: () => void;
  longingBtnSend: boolean;
  setLongingBtnSend: (value: boolean) => void;
  order:Shipment | null;
  setOrder: (order: Shipment) => void;
}

const ShippingQuoteDrawerContext = createContext<ShippingQuoteDrawerContextType | undefined>(undefined);

const DRAWER_STATE_KEY = 'isDrawerOpenEditOrder';

export const ShippingQuoteDrawerProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [longingBtnSend, setLongingBtnSend] = useState(false);
  const [order, setOrder] = useState<Shipment | null>(null);

  const [isDrawerOpenEditOrder, setDrawerOpenEditOrder] = useState(() => {
    if (typeof window === 'undefined') {
        return false;
    }
    const storedValue = getFromStorage(DRAWER_STATE_KEY);
    return storedValue === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveToStorage(DRAWER_STATE_KEY, String(isDrawerOpenEditOrder));
    }
  }, [isDrawerOpenEditOrder]); 

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const openDrawerEditOrde = () => setDrawerOpenEditOrder(true);
  const closeDrawerEditOrde = () => setDrawerOpenEditOrder(false);

  const contextValue: ShippingQuoteDrawerContextType = {
    isOpen,
    isDrawerOpenEditOrder,
    openDrawer,
    closeDrawer,
    longingBtnSend,
    setLongingBtnSend,
    closeDrawerEditOrde,
    openDrawerEditOrde,
    order,
    setOrder
  };

  return (
    <ShippingQuoteDrawerContext.Provider value={contextValue}>
      {children}
    </ShippingQuoteDrawerContext.Provider>
  );
};

export const useShippingQuoteDrawer = (): ShippingQuoteDrawerContextType => {
  const context = useContext(ShippingQuoteDrawerContext);
  if (!context) {
    throw new Error('useShippingQuoteDrawer must be used within a ShippingQuoteDrawerProvider');
  }
  return context;
};
