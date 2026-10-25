import { useState, useMemo, useCallback, useEffect } from 'react';
import { PRODUCT_TYPE_OPTIONS } from '../../../../utils/mooks/packages/packages.mooks';
import PackageService from '../../../../services/PackageService';
import { CalculateShipmentWeights } from '../../../../utils/CalculateShipmentWeights.utils';
import { useNotification } from '../../../../context/NotificationContext';
import { PackageResponse } from '../../../../types';

export const useAddPackageDrawer = (initialPackage?: PackageResponse, isOpen?: boolean) => {
  const { showNotification } = useNotification();
  const isEditMode = !!initialPackage;

  const [formData, setFormData] = useState({
    alias: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    productTypeCode: '',
    productTypeDescription: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (initialPackage) {
      const fullProductType = initialPackage.productType || '';
      const [code, ...descParts] = fullProductType.split(' - ');
      const description = descParts.join(' - ');

      setFormData({
        alias: initialPackage.alias || '',
        length: initialPackage.lengthCm ? Math.round(Number(initialPackage.lengthCm)).toString() : '',
        width: initialPackage.widthCm ? Math.round(Number(initialPackage.widthCm)).toString() : '',
        height: initialPackage.heightCm ? Math.round(Number(initialPackage.heightCm)).toString() : '',
        weight: initialPackage.weightKg ? Math.round(Number(initialPackage.weightKg)).toString() : '',
        productTypeCode: code?.trim() || '',
        productTypeDescription: description?.trim() || '',
      });
    } else {
      handleReset();
    }
  }, [initialPackage]);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const productTypes = useMemo(() => {
    return PRODUCT_TYPE_OPTIONS.map(opt => {
      const [code, ...descriptionParts] = opt.label.split(' - ');
      return {
        code: code.trim(),
        description: descriptionParts.join(' - ').trim()
      };
    });
  }, []);

  const weights = useMemo(() => {
    return CalculateShipmentWeights({
      weight: formData.weight,
      length: formData.length,
      height: formData.height,
      width: formData.width,
    });
  }, [formData]);

  const volumetricWeight = weights.volumetricWeight.toFixed(2);
  const quotedWeight = Math.ceil(weights.quotedWeight).toString();

  const errors = useMemo(() => ({
    alias: formData.alias.trim() === '' ? 'Campo obligatorio' : undefined,
    length: formData.length === '' ? 'Campo obligatorio' : undefined,
    width: formData.width === '' ? 'Campo obligatorio' : undefined,
    height: formData.height === '' ? 'Campo obligatorio' : undefined,
    weight: formData.weight === '' ? 'Campo obligatorio' : undefined,
    productTypeCode: formData.productTypeCode === '' ? 'Campo obligatorio' : undefined,
  }), [formData]);

  const isFormValid = useMemo(() => !Object.values(errors).some(err => err !== undefined), [errors]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['length', 'width', 'height', 'weight'].includes(name)) {
      const sanitizedValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleProductSelect = useCallback((opt: { code: string; description: string }) => {
    setFormData(prev => ({
      ...prev,
      productTypeCode: opt.code,
      productTypeDescription: opt.description
    }));
  }, []);

  const handleReset = useCallback(() => {
    if (isEditMode && initialPackage) {
      const fullProductType = initialPackage.productType || '';
      const [code, ...descParts] = fullProductType.split(' - ');
      const description = descParts.join(' - ');

      setFormData({
        alias: initialPackage.alias || '',
        length: initialPackage.lengthCm ? Math.round(Number(initialPackage.lengthCm)).toString() : '',
        width: initialPackage.widthCm ? Math.round(Number(initialPackage.widthCm)).toString() : '',
        height: initialPackage.heightCm ? Math.round(Number(initialPackage.heightCm)).toString() : '',
        weight: initialPackage.weightKg ? Math.round(Number(initialPackage.weightKg)).toString() : '',
        productTypeCode: code?.trim() || '',
        productTypeDescription: description?.trim() || '',
      });
    } else {
      setFormData({
        alias: '', length: '', width: '', height: '', weight: '',
        productTypeCode: '', productTypeDescription: ''
      });
    }
    setError(null);
    setShowErrors(false);
  }, [isEditMode, initialPackage]);

  const handleSubmit = async (onSuccess: (data: PackageResponse) => void) => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }

    setIsLoading(true);
    setError(null);



    const submitData = {
      ...formData,
      volumetricWeight: parseFloat(volumetricWeight),
      quotedWeight: parseFloat(quotedWeight),
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
    };

    const satValue = submitData.productTypeDescription
      ? `${submitData.productTypeCode} - ${submitData.productTypeDescription}`
      : submitData.productTypeCode;

    try {
      if (isEditMode) {
        const result = await PackageService.updatePackage(initialPackage.uid, {
          alias: submitData.alias,
          productType: satValue,
          weightKg: submitData.weight,
          lengthCm: submitData.length,
          widthCm: submitData.width,
          heightCm: submitData.height,
        });
        showNotification(" Exito ", "Paquete actualizado exitosamente.", 'success', 5000);
        onSuccess(result);
      } else {
        const result = await PackageService.createPackage({
          alias: submitData.alias,
          productType: satValue,
          weightKg: submitData.weight,
          lengthCm: submitData.length,
          widthCm: submitData.width,
          heightCm: submitData.height,
        });
        showNotification(" Exito ", "Paquete creado exitosamente.", 'success', 5000);
        onSuccess(result);
      }
    } catch (err: any) {
      showNotification(" Ups, algo salio mal ", err.response.data.message || "Error al crear el paquete.", 'error', 5000);
      setError(err.response.data.message || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    volumetricWeight,
    quotedWeight,
    productTypes,
    isFormValid,
    isLoading,
    error,
    showErrors,
    errors,
    isEditMode,
    handleChange,
    handleReset,
    handleProductSelect,
    handleSubmit,
  };
};