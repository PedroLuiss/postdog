
import styles from './PickupView.module.scss';
import { FilterValues } from '../../../types';
import { PickupsUnauthorizedState } from '../../../components/Pickups/PickupsUnauthorizedState/PickupsUnauthorizedState';
import { SchedulePickupModal } from '../../../components/Pickups/SchedulePickupModal/SchedulePickupModal';
import { PickupsListSection } from '../../../components/Pickups/PickupsListSection/PickupsListSection';
import { FinalizeShippingModal } from '../../../components/FinalizeShippingModal/FinalizeShippingModal';
import { usePickup } from '../../../hooks/usePickup';
import { usePickupForm } from '../../../hooks/usePickupForm';
import { useRef } from 'react';

const initialFilterValues: FilterValues = {
  searchTerm: '',
  startDate: '',
  endDate: '',
  statuses: [],
  stores: [],
  integrations: [],
};

export const PickupView = () => {
  const {
    isLoading,
    scheduledPickups,
    loadMore,
    hasMore,
    schedulePickup,
    onRefresh
  } = usePickup(initialFilterValues, false);

  const {
    isModalOpen,
    formData,
    openModal,
    closeModal,
    handleInputChange,
    handleFormSubmit,
    carrierOptions,
    referenceOrderOptions,
    pickupDateOptions,
    isFormValid,
    isLoading: isCreatingPickup,
  } = usePickupForm((data) => {
    schedulePickup(data);
    onRefresh();
  }, false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);


  const hasPickups = scheduledPickups.length > 0;

  return (
    <div className={styles['pickups-page']} ref={scrollContainerRef}>

      <div className={styles['content-area']}>
        {!hasPickups ? (
          <PickupsUnauthorizedState onAction={openModal} />
        ) : (
          <PickupsListSection
            pickups={scheduledPickups}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onProgramarRecoleccion={openModal}
          />
        )}
      </div>
      <FinalizeShippingModal />
      <SchedulePickupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
        carrierOptions={carrierOptions}
        referenceOrderOptions={referenceOrderOptions}
        pickupDateOptions={pickupDateOptions}
        isFormValid={isFormValid}
        isLoading={isCreatingPickup}
      />
    </div>
  );
};