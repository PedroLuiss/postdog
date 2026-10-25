import { useState, useCallback, useEffect } from 'react';
import { PricingRule, PricingRulesService, NestedCarrierCatalogItem, PricingRuleBulkPayload } from '../../../../services/PricingRulesService';
import { useNotification } from '../../../../context/NotificationContext';

export interface EditableRule extends Omit<PricingRuleBulkPayload, 'carrierCode' | 'serviceCode' | 'plan'> {
  uniqueId: string;
  isNew?: boolean;
  isModified?: boolean;
  isDeleted?: boolean;

  carrierCode: string;
  serviceCode: string;
  plan: string;

  // Making sure minMargin and percentage can be edited easily with empty string temporarily
  minMarginInputValue: number | '';
  maxMarginInputValue: number | '';
  percentageInputValue: number | '';
}

export const usePricingRules = () => {
  const [editableRules, setEditableRules] = useState<EditableRule[]>([]);
  const [carriers, setCarriers] = useState<NestedCarrierCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [rulesRes, catalogsRes] = await Promise.all([
        PricingRulesService.getRules(),
        PricingRulesService.getCatalogs()
      ]);
      
      setCarriers(catalogsRes);

      const loadedRules = rulesRes.map(rule => ({
        uniqueId: String(rule.id),
        id: rule.id,
        carrierCode: rule.carrierCode,
        serviceCode: rule.serviceCode,
        plan: rule.plan,
        minMargin: rule.minMargin,
        maxMargin: rule.maxMargin,
        percentage: rule.percentage,
        minMarginInputValue: rule.minMargin,
        maxMarginInputValue: rule.maxMargin !== null && rule.maxMargin !== undefined ? rule.maxMargin : ('' as const),
        percentageInputValue: rule.percentage,
        isNew: false,
        isModified: false,
      }));

      setEditableRules(loadedRules);
    } catch (error) {
      showNotification('Error', 'Error al cargar las reglas de precios.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRule = useCallback(() => {
    const newRule: EditableRule = {
      uniqueId: `new_${Date.now()}_${Math.random()}`,
      isNew: true,
      isModified: true, // Auto-mark as modified to be sent
      carrierCode: '',
      serviceCode: '',
      plan: '',
      minMargin: 0,
      minMarginInputValue: '',
      maxMargin: null,
      maxMarginInputValue: '',
      percentage: 0,
      percentageInputValue: '',
    };
    // Pretend row addition adds it at the top
    setEditableRules(prev => [newRule, ...prev]);
  }, []);

  const handleChangeField = useCallback((uniqueId: string, field: keyof EditableRule, value: any) => {
    setEditableRules(prev => prev.map(rule => {
      if (rule.uniqueId !== uniqueId) return rule;
      return {
        ...rule,
        [field]: value,
        isModified: true
      };
    }));
  }, []);

  const handleDeleteLocal = useCallback(async (uniqueId: string) => {
    const rule = editableRules.find(r => r.uniqueId === uniqueId);
    if (!rule) return;

    if (rule.isNew) {
      // It's a localized row that has not been saved, purely remove it
      setEditableRules(prev => prev.filter(r => r.uniqueId !== uniqueId));
      return;
    }

    try {
      setIsLoading(true);
      await PricingRulesService.deleteRule(rule.id as number);
      showNotification('Éxito', 'Regla eliminada exitosamente.', 'success');
      loadData();
    } catch (e) {
      showNotification('Error', 'Error al eliminar la regla.', 'error');
      setIsLoading(false); // Reset loading here since loadData won't be called
    }
  }, [editableRules, loadData, showNotification]);

  const handleSaveBulk = useCallback(async () => {
    // Only send the ones that are modified
    const modifiedRules = editableRules.filter(r => r.isModified && !r.isDeleted);
    
    if (modifiedRules.length === 0) {
      showNotification('Información', 'No hay cambios pendientes por guardar.', 'info');
      return;
    }

    // Validate
    const hasErrors = modifiedRules.some(r => {
      if (!r.carrierCode || !r.serviceCode || !r.plan) return true;
      if (r.minMarginInputValue === '' || r.percentageInputValue === '') return true;
      return false;
    });

    if (hasErrors) {
      showNotification('Error', 'Por favor llena todos los campos obligatorios antes de guardar.', 'error');
      return;
    }

    // Validate for duplicates (Carrier + Service + Plan)
    const activeRules = editableRules.filter(r => !r.isDeleted);
    const seenCombos = new Set<string>();
    for (const r of activeRules) {
      if (!r.carrierCode || !r.serviceCode || !r.plan) continue;
      const key = `${r.carrierCode}-${r.serviceCode}-${r.plan}`;
      if (seenCombos.has(key)) {
        showNotification('Error', `La configuración para ${r.carrierCode} - ${r.serviceCode} (${r.plan.toUpperCase()}) ya existe o está duplicada.`, 'error');
        return;
      }
      seenCombos.add(key);
    }

    const payloadRules: PricingRuleBulkPayload[] = modifiedRules.map(r => {
      const basePayload = {
        carrierCode: r.carrierCode.toUpperCase(),
        serviceCode: r.serviceCode.toLowerCase(),
        plan: r.plan.toUpperCase(),
        minMargin: r.minMarginInputValue as number,
        maxMargin: r.maxMarginInputValue === '' ? null : (r.maxMarginInputValue as number),
        percentage: r.percentageInputValue as number
      };

      if (r.isNew) {
        // Modo 2: Upsert por Combinación
        return basePayload;
      } else {
        // Modo 1: Actualización por ID
        return {
          id: r.id as number,
          ...basePayload
        };
      }
    });

    try {
      setIsSaving(true);
      const res = await PricingRulesService.bulkUpdateRules({ rules: payloadRules });
      showNotification('Éxito', res.message, 'success');
      await loadData(); // Reload from remote source to clear modified status and get true IDs
    } catch (e) {
      showNotification('Error', 'Ocurrió un error al guardar masivamente.', 'error');
    } finally {
      setIsSaving(false);
    }

  }, [editableRules, loadData, showNotification]);

  return {
    editableRules,
    carriers,
    isLoading,
    isSaving,
    handleAddRule,
    handleChangeField,
    handleDeleteLocal,
    handleSaveBulk,
    loadData
  };
};
