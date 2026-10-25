import React from 'react';
import styles from './PricingRulesTable.module.scss';
import ButtonUi from '../../../../../components/ui/Button/ButtonUi';
import InputUi from '../../../../../components/ui/Input/InputUi';
import SelectUi from '../../../../../components/ui/SelectUi/SelectUi';
import { Trash2 } from 'lucide-react';
import { EditableRule } from '../../hooks/usePricingRules';
import { NestedCarrierCatalogItem } from '../../../../../services/PricingRulesService';

interface PricingRulesTableProps {
  rules: EditableRule[];
  carriers: NestedCarrierCatalogItem[];
  isLoading: boolean;
  onFieldChange: (uniqueId: string, field: keyof EditableRule, value: any) => void;
  onDelete: (uniqueId: string) => void;
  isReadOnly?: boolean;
}

export enum PricingPlan {
  CHIHUAHUA = 'CHIHUAHUA',
  PUG = 'PUG',
  HUSKY = 'HUSKY',
  PITBULL = 'PITBULL',
}

const PLAN_OPTIONS = [
  { value: PricingPlan.CHIHUAHUA, label: 'Chihuahua' },
  { value: PricingPlan.PUG, label: 'Pug' },
  { value: PricingPlan.HUSKY, label: 'Husky' },
  { value: PricingPlan.PITBULL, label: 'Pitbull' },
];

export const PricingRulesTable: React.FC<PricingRulesTableProps> = ({ 
  rules, 
  carriers,
  isLoading, 
  onFieldChange,
  onDelete,
  isReadOnly = false
}) => {
  if (isLoading && rules.length === 0) {
    return <div className={styles.table__loading}>Cargando reglas...</div>;
  }

  if (!rules || rules.length === 0) {
    return <div className={styles.table__empty}>No hay reglas configuradas. Añade una nueva.</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Carrier</th>
              <th>Service</th>
              <th>Plan</th>
              <th>Min Margin ($)</th>
              <th>Max Margin ($)</th>
              <th>Percentage (%)</th>
              {!isReadOnly && <th className={styles.table__actionsCol}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => {
              let rowClass = '';
              if (rule.isNew) rowClass = styles['table__row--new'];
              else if (rule.isModified) rowClass = styles['table__row--modified'];

              const selectedCarrier = carriers.find(c => c.carrierCode === rule.carrierCode);
              const availableServices = selectedCarrier ? selectedCarrier.services : [];

              return (
                <tr key={rule.uniqueId} className={rowClass}>
                  <td>{rule.isNew ? 'Nuevo' : rule.id}</td>
                
                <td>
                  {rule.isNew ? (
                    <SelectUi
                      options={carriers.map(c => ({ value: c.carrierCode, label: c.carrierName }))}
                      value={rule.carrierCode}
                      onChange={(e) => {
                        onFieldChange(rule.uniqueId, 'carrierCode', e.target.value);
                        onFieldChange(rule.uniqueId, 'serviceCode', ''); // reset service on carrier change
                      }}
                      placeholder="Seleccionar..."
                      containerClassName={styles.table__select}
                      showMessageError={false}
                      disabled={isReadOnly}
                    />
                  ) : (
                    rule.carrierCode
                  )}
                </td>

                <td>
                  {rule.isNew ? (
                    <SelectUi
                      options={availableServices.map(s => ({ value: s.serviceCode, label: s.serviceName }))}
                      value={rule.serviceCode}
                      onChange={(e) => onFieldChange(rule.uniqueId, 'serviceCode', e.target.value)}
                      placeholder="Seleccionar..."
                      containerClassName={styles.table__select}
                      showMessageError={false}
                      disabled={!rule.carrierCode || availableServices.length === 0 || isReadOnly}
                    />
                  ) : (
                    rule.serviceCode
                  )}
                </td>

                <td className={styles.table__plan}>
                  {rule.isNew ? (
                    <SelectUi
                      options={PLAN_OPTIONS}
                      value={rule.plan}
                      onChange={(e) => onFieldChange(rule.uniqueId, 'plan', e.target.value)}
                      placeholder="Plan"
                      containerClassName={styles.table__select}
                      showMessageError={false}
                      disabled={isReadOnly}
                    />
                  ) : (
                    rule.plan.toUpperCase()
                  )}
                </td>

                <td>
                  <InputUi
                    type="number"
                    step="0.01"
                    value={rule.minMarginInputValue}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : parseFloat(e.target.value);
                      onFieldChange(rule.uniqueId, 'minMarginInputValue', isNaN(v as any) && e.target.value !== '' ? '' : v);
                    }}
                    containerClassName={styles.table__input}
                    placeholder="Ej 30.5"
                    showMessageError={false}
                    disabled={isReadOnly}
                  />
                </td>

                <td>
                  <InputUi
                    type="number"
                    step="0.01"
                    value={rule.maxMarginInputValue}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : parseFloat(e.target.value);
                      onFieldChange(rule.uniqueId, 'maxMarginInputValue', isNaN(v as any) && e.target.value !== '' ? '' : v);
                    }}
                    containerClassName={styles.table__input}
                    placeholder="Opcional"
                    showMessageError={false}
                    disabled={isReadOnly}
                  />
                </td>

                <td>
                  <InputUi
                    type="number"
                    step="0.1"
                    value={rule.percentageInputValue}
                    onChange={(e) => {
                      const v = e.target.value === '' ? '' : parseFloat(e.target.value);
                      onFieldChange(rule.uniqueId, 'percentageInputValue', isNaN(v as any) && e.target.value !== '' ? '' : v);
                    }}
                    containerClassName={styles.table__input}
                    placeholder="Ej 10.5"
                    showMessageError={false}
                    disabled={isReadOnly}
                  />
                </td>

                {!isReadOnly && (
                  <td className={styles.table__actionsCol}>
                    <ButtonUi
                      variant="light"
                      className={styles.table__deleteBtn}
                      onClick={() => onDelete(rule.uniqueId)}
                      icon={<Trash2 size={16} />}
                    />
                  </td>
                )}
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
