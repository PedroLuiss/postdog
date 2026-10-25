import { useState, useMemo } from 'react';
import { CalendarDay } from '../types/custom-calendar.type';

export const useCustomCalendar = (selectedDate: string | undefined, onSelect: (date: string) => void) => {
    const initialDate = useMemo(() => selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date(), [selectedDate]);
    const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days: CalendarDay[] = [];

        const prevMonthLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDate - i,
                month: month - 1,
                year: year,
                isOutside: true
            });
        }

        for (let i = 1; i <= lastDate; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isOutside: false
            });
        }

        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                day: i,
                month: month + 1,
                year: year,
                isOutside: true
            });
        }

        return days;
    }, [viewDate]);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSelectDay = (dayObj: { day: number, month: number, year: number }) => {
        const date = new Date(dayObj.year, dayObj.month, dayObj.day);
        const formatted = date.toISOString().split('T')[0];
        onSelect(formatted);
    };

    const isSelected = (day: number, month: number, year: number) => {
        if (!selectedDate) return false;
        const d = new Date(year, month, day);
        return d.toISOString().split('T')[0] === selectedDate;
    };

    const isToday = (day: number, month: number, year: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    return {
        viewDate,
        monthNames,
        daysOfWeek,
        daysInMonth,
        handlePrevMonth,
        handleNextMonth,
        handleSelectDay,
        isSelected,
        isToday
    };
};
