import { IconPropsType } from './types/IconsProps.type';

type CalendarIconProps = IconPropsType;

export const CalendarIcon = ({
    width = 16,
    height = 16,
    className = '',
    fillColor = 'none',
}: CalendarIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fillColor}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
        </svg>
    );
};
