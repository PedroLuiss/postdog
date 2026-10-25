export interface NoMovementsRecordedProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export interface NoMovementsEmptyProps {
    title: string;
    description: string;
    buttonText: string;
    handleAction: () => void;
}

export interface MovementsTableProps {
    buttonText: string;
    handleAction: () => void;
}
