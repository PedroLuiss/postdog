import { UnsubscribeStatus } from '../../../../pages/Public/Unsubscribe/hooks/useUnsubscribePage';

export interface UnsubscribeContainerProps {
    status: UnsubscribeStatus;
    handleConfirm: () => void;
    handleCancel: () => void;
    goToHome: () => void;
    resetStatus: () => void;
}