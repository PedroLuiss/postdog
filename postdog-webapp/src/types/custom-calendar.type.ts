export interface CalendarDay {
    day: number;
    month: number;
    year: number;
    isOutside: boolean;
}

export interface CustomCalendarProps {
    selectedDate?: string;
    onSelect: (date: string) => void;
    align?: 'left' | 'right';
    className?: string;
}
