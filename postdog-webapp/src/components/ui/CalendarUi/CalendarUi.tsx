import React from 'react';

//style
import styles from './CalendarUi.module.scss';

//material Mui
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

//types
import { CustomCalendarProps } from '../../../types/custom-calendar.type';

//Hook
import { useCustomCalendar } from '../../../hooks/useCustomCalendar';

export const CalendarUi: React.FC<CustomCalendarProps> = ({
    selectedDate,
    onSelect,
    align = 'left',
    className
}) => {
    const {
        viewDate,
        monthNames,
        daysOfWeek,
        daysInMonth,
        handlePrevMonth,
        handleNextMonth,
        handleSelectDay,
        isSelected,
        isToday
    } = useCustomCalendar(selectedDate, onSelect);

    return (
        <div
            className={`${styles['calendar-popover']} ${align === 'right' ? styles['calendar-popover--right'] : ''} ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={styles['calendar']}>
                <div className={styles['calendar__header']}>
                    <button className={styles['calendar__nav-btn']} onClick={handlePrevMonth}>
                        <KeyboardArrowLeftIcon />
                    </button>
                    <span className={styles['calendar__current-month']}>
                        {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button className={styles['calendar__nav-btn']} onClick={handleNextMonth}>
                        <KeyboardArrowRightIcon />
                    </button>
                </div>

                <table className={styles['calendar__grid']}>
                    <thead>
                        <tr>
                            {daysOfWeek.map(day => (
                                <th key={day} className={styles['calendar__weekday']}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 6 }).map((_, weekIdx) => {
                            const daysInWeek = daysInMonth.slice(weekIdx * 7, (weekIdx + 1) * 7);
                            const hasCurrentMonthDay = daysInWeek.some(d => !d.isOutside);
                            if (weekIdx >= 4 && !hasCurrentMonthDay) return null;

                            return (
                                <tr key={weekIdx}>
                                    {daysInWeek.map((dayObj, dayIdx) => (
                                        <td key={dayIdx} className={styles['calendar__day-cell']}>
                                            <button
                                                className={`
                                                    ${styles['calendar__day']} 
                                                    ${dayObj.isOutside ? styles['calendar__day--outside'] : ''}
                                                    ${isSelected(dayObj.day, dayObj.month, dayObj.year) ? styles['calendar__day--selected'] : ''}
                                                    ${isToday(dayObj.day, dayObj.month, dayObj.year) ? styles['calendar__day--today'] : ''}
                                                `}
                                                onClick={() => handleSelectDay(dayObj)}
                                            >
                                                {dayObj.day}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
