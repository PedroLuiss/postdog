import { FilterValues } from '../types';

export const calculateDatesFromRange = (range: string) => {
    const now = new Date();
    let start = new Date();
    const end = new Date();

    switch (range) {
        case 'Hoy':
            start.setHours(0, 0, 0, 0);
            break;
        case 'Últimos 7 días':
            start.setDate(now.getDate() - 7);
            break;
        case '30 días':
        case 'Últimos 30 días':
            start.setDate(now.getDate() - 30);
            break;
        case '3 meses':
        case 'Últimos 3 meses':
            start.setMonth(now.getMonth() - 3);
            break;
        case 'Personalizado':
            return null;
        case 'Todas':
        default:
            return { startDate: '', endDate: '' };
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
    };
};

export const handleDateRangeChange = (
    range: string,
    currentFilters: FilterValues,
    onChange: (f: FilterValues) => void
) => {
    const result = calculateDatesFromRange(range);
    const newFilters = {
        ...currentFilters,
        dateRange: [range]
    };

    if (result !== null) {
        newFilters.startDate = result.startDate;
        newFilters.endDate = result.endDate;
    }

    onChange(newFilters);
};

export const handleFilterToggle = (
    field: keyof FilterValues,
    option: string,
    currentFilters: FilterValues,
    onChange: (f: FilterValues) => void,
    optionsList?: string[]
) => {
    const currentSelection = (currentFilters[field] as string[]) || [];
    let newSelection: string[];

    if (option === 'Todos' && optionsList) {
        if (currentSelection.includes('Todos')) {
            newSelection = [];
        } else {
            newSelection = [...optionsList];
        }
    } else {
        if (currentSelection.includes(option)) {
            newSelection = currentSelection.filter(item => item !== option && item !== 'Todos');
        } else {
            newSelection = [...currentSelection, option];
            if (optionsList) {
                const allOthersSelected = optionsList
                    .filter(opt => opt !== 'Todos')
                    .every(opt => newSelection.includes(opt));
                if (allOthersSelected && !newSelection.includes('Todos')) {
                    newSelection = [...optionsList];
                }
            }
        }
    }

    onChange({ ...currentFilters, [field]: newSelection });
};

export const handleSingleFilterSelect = (
    field: keyof FilterValues,
    option: string,
    currentFilters: FilterValues,
    onChange: (f: FilterValues) => void
) => {
    const newSelection = [option];
    onChange({ ...currentFilters, [field]: newSelection });
};
