import React from 'react';
import { Accordion } from './Accordion';
import styles from './StepThree.module.scss';
import { ShippingOptions } from './Table/ShippingOptions';
import { PaymentDetails } from './PaymentDetails/PaymentDetails';
import { ShippingOption, SortConfig, StepThreeErrors } from '../../../../types';
import { TruckIcon } from '../../../icons';

interface StepThreeProps {
  filteredAndSortedOptions: ShippingOption[];
  selectedOption: ShippingOption | undefined;
  selectedOptionId: string | null;
  handleSelectOption: (id: string) => void;
  handleSort: (key: "estimatedDelivery" | "price") => void;
  sortConfig: SortConfig;
  isAccordionOpen: boolean;
  setIsAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  availableCarriers: string[];
  selectedCarriers: string[];
  setSelectedCarriers: React.Dispatch<React.SetStateAction<string[]>>;
  isPawSafeActive: boolean;
  handlePawSafeToggle: (isActive: boolean) => void;
  declaredValue: string;
  setDeclaredValue: React.Dispatch<React.SetStateAction<string>>;
  errors: StepThreeErrors;
  handleSend: () => void;
  loadingParcel?: boolean;
}

export const StepThree: React.FC<StepThreeProps> = ({
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
  errors,
  handleSend,
  loadingParcel = false
}) => {
  const AccordionSummary = () => {
    if (!selectedOption) {
      return (
        <div className={styles['accordionSummary--placeholder']}>
          <p className={styles['accordionSummary__message']}>
            ¡No olvides seleccionar una paquetería para continuar! <TruckIcon/>
          </p>
        </div>
      );
      
    }
    return (
      <div className={styles['accordionSummary']}>
        <img src={selectedOption.logo} alt={`${selectedOption.carrier} logo`} className={styles['accordionSummary__logo']} />
        <div className={styles['accordionSummary__details']}>
          <strong>{selectedOption.carrier} {selectedOption.service}</strong>
          <span>Recolección: {selectedOption.collection}</span>
          <span>Entrega estimada: {selectedOption.estimatedDelivery}</span>
        </div>
        <span className={styles['accordionSummary__price']}>${selectedOption.price.toFixed(2)} MXN</span>
      </div>
    );
  };

  return (
    <div className={styles['step-three']}>
      <Accordion
        title="Paquetería"
        summaryContent={<AccordionSummary />}
        isOpen={isAccordionOpen || !selectedOption}
        onToggle={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        {errors.selectedOption && !isAccordionOpen && (
          <p className={styles['error-message']}>{errors.selectedOption}</p>
        )}
        <ShippingOptions
          options={filteredAndSortedOptions}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          onSort={handleSort}
          sortConfig={sortConfig}
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterClose={() => setIsFilterOpen(false)}
          availableCarriers={availableCarriers}
          selectedCarriers={selectedCarriers}
          onFilterChange={setSelectedCarriers}
          loading={loadingParcel}
        />
      </Accordion>
      <PaymentDetails
        shippingCost={selectedOption?.price || 0}
        error={errors.declaredValue}
        isPawSafeActive={isPawSafeActive}
        onPawSafeToggle={handlePawSafeToggle}
        declaredValue={declaredValue}
        onDeclaredValueChange={setDeclaredValue}
        handleSend={handleSend}
      />
    </div>
  );
};