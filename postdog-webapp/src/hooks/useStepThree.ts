import { useState, useMemo, useEffect } from 'react';
import { useQuotes } from './useQuotes';
import { ShippingOption, SortConfig, StepThreeErrors } from '../types';
import { getFromStorage, saveToStorage } from '../utils/storage.utils';

interface StoredStepThreeData {
    selectedOptionId: string | null;
    isPawSafeActive: boolean;
    declaredValue: string;
}

export const useStepThree = () => {
  const { quotes, loading, getQuotes } = useQuotes();

  const getInitialStepThreeData = (): StoredStepThreeData => {
    const storedData = getFromStorage<StoredStepThreeData>('stepThreeData');

    return storedData ?? {
      selectedOptionId: null,
      isPawSafeActive: false,
      declaredValue: '',
    };
  };

  const initialStepThreeData = getInitialStepThreeData();

  const shippingOptionsData: ShippingOption[] = useMemo(() => {
    return quotes.map(quote => ({
      id: quote.id.toString(),
      logo: quote.courierLogo,
      carrier: quote.courierName,
      service: quote.service,
      collection: quote.pickup,
      estimatedDelivery: `${quote.deliveryEstimateDays} ${quote.deliveryEstimateDays === 1 ? 'día' : 'días'}`,
      price: quote.price,
    }));
  }, [quotes]);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialStepThreeData.selectedOptionId);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isPawSafeActive, setIsPawSafeActive] = useState<boolean>(initialStepThreeData.isPawSafeActive);
  const [declaredValue, setDeclaredValue] = useState<string>(initialStepThreeData.declaredValue);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [errors, setErrors] = useState<StepThreeErrors>({});


  const availableCarriers = useMemo(() => {
    return Array.from(new Set(shippingOptionsData.map(opt => opt.carrier)));
  }, [shippingOptionsData]);

  const [selectedCarriers, setSelectedCarriers] = useState<string[]>(availableCarriers);


  useEffect(() => {
    setSelectedCarriers(availableCarriers);
  }, [availableCarriers]);

  useEffect(() => {
    const dataToStore: StoredStepThreeData = {
        selectedOptionId,
        isPawSafeActive,
        declaredValue,
    };
    saveToStorage('stepThreeData', dataToStore);
  }, [selectedOptionId, isPawSafeActive, declaredValue]);

  const filteredAndSortedOptions = useMemo(() => {
    let processableOptions = [...shippingOptionsData];
    if (selectedCarriers.length < availableCarriers.length) {
      processableOptions = processableOptions.filter(option => selectedCarriers.includes(option.carrier));
    }

    const { key, direction } = sortConfig;
    if (key !== null) {
      processableOptions.sort((a, b) => {
        const aValue = key === 'estimatedDelivery' ? parseInt(a.estimatedDelivery) : a[key];
        const bValue = key === 'estimatedDelivery' ? parseInt(b.estimatedDelivery) : b[key];
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }


    return processableOptions;
  }, [sortConfig, selectedCarriers, availableCarriers.length, quotes, shippingOptionsData]);

  const selectedOption = useMemo(() => {
    return shippingOptionsData.find(opt => opt.id === selectedOptionId);
  }, [selectedOptionId, shippingOptionsData]);

  const pawSafeCost = useMemo(() => {
    if (!isPawSafeActive || isNaN(parseFloat(declaredValue))) return 0;
    return parseFloat(declaredValue);
  }, [isPawSafeActive, declaredValue]);

  const total = (selectedOption?.price || 0) + pawSafeCost;

  const validateStep = (): boolean => {
    const newErrors: StepThreeErrors = {};

    if (!selectedOptionId) {
      newErrors.selectedOption = 'Debes seleccionar una opción de paquetería.';
    }

    if (isPawSafeActive) {
      const numericValue = parseFloat(declaredValue);
      if (declaredValue.trim() === '') {
        newErrors.declaredValue = 'El valor declarado es requerido.';
      } else if (isNaN(numericValue)) {
        newErrors.declaredValue = 'Debe ser un número válido.';
      } else if (numericValue < 100 || numericValue > 100000) {
        newErrors.declaredValue = 'El valor debe estar entre $100 y $100,000.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSort = (key: 'estimatedDelivery' | 'price') => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'asc' };
    });
  };

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    setIsAccordionOpen(false);
  };

  const handlePawSafeToggle = (isActive: boolean) => {
    setIsPawSafeActive(isActive);
  };

  return {
    loading,
    getQuotes,
    filteredAndSortedOptions,
    selectedOption,
    selectedOptionId,
    handleSelectOption,
    handleSort,
    sortConfig,
    isAccordionOpen,
    setIsAccordionOpen,
    isFilterOpen,
    setIsFilterOpen,
    availableCarriers,
    selectedCarriers,
    setSelectedCarriers,
    isPawSafeActive,
    handlePawSafeToggle,
    declaredValue,
    setDeclaredValue,
    total, 
    errors, 
    validateStep,
  };
};
