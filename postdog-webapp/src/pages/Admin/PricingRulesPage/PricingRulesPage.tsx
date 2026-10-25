import React, { useState } from 'react';
import styles from './PricingRulesPage.module.scss';
import { PricingRulesTable } from './components/PricingRulesTable/PricingRulesTable';
import { usePricingRules } from './hooks/usePricingRules';
import ButtonUi from '../../../components/ui/Button/ButtonUi';
import { AlertDialogUi } from '../../../components/ui/AlertDialogUi/AlertDialogUi';
import { Plus, Save } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

export const PricingRulesPage: React.FC = () => {
  const { user } = useAppContext();
  const isVendor = user?.role?.toUpperCase() === 'VENDOR';

  const {
    editableRules,
    carriers,
    isLoading,
    isSaving,
    handleAddRule,
    handleChangeField,
    handleDeleteLocal,
    handleSaveBulk
  } = usePricingRules();

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const requestDelete = (uniqueId: string) => {
    if (isVendor) return;
    const rule = editableRules.find(r => r.uniqueId === uniqueId);
    if (rule?.isNew) {
      handleDeleteLocal(uniqueId);
    } else {
      setRuleToDelete(uniqueId);
    }
  };

  const confirmDelete = async () => {
    if (isVendor) return;
    if (ruleToDelete) {
      await handleDeleteLocal(ruleToDelete);
      setRuleToDelete(null);
    }
  };

  return (
    <div className={styles.rulesPage}>
      <div className={styles.rulesPage__header}>
        <div>
          <p className={styles.rulesPage__description}>
            {isVendor 
              ? "Lista de márgenes de ganancia configurados para los planes de envío (Modo lectura)."
              : "Configura los márgenes de ganancia mínimos, máximos y el porcentaje para los planes de envío."
            }
          </p>
        </div>
        {!isVendor && (
          <div className={styles.rulesPage__actions}>
            <ButtonUi 
              variant="secondary" 
              onClick={handleAddRule} 
              icon={<Plus size={18} />} 
              disabled={isLoading || isSaving}
            >
              Añadir Regla
            </ButtonUi>
            <ButtonUi 
              variant="primary" 
              onClick={handleSaveBulk} 
              isLoading={isSaving} 
              icon={<Save size={18} />}
              disabled={isLoading}
            >
              Guardar Cambios
            </ButtonUi>
          </div>
        )}
      </div>

      <PricingRulesTable 
        rules={editableRules}
        carriers={carriers}
        isLoading={isLoading} 
        onFieldChange={handleChangeField}
        onDelete={requestDelete} 
        isReadOnly={isVendor}
      />

      <AlertDialogUi
        isOpen={!!ruleToDelete}
        onClose={() => setRuleToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar regla de precios"
        description="¿Estás seguro de eliminar esta regla permanentemente? Esta acción repercutirá de inmediato en las cotizaciones a usuarios."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isLoading={isLoading}
      />
    </div>
  );
};
