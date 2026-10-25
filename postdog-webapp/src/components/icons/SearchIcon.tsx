import { IconPropsType } from './types/IconsProps.type';

export const SearchIcon = ({
    width = 24,
    height = 24,
    className = '',
    style = {},
    strokeColor = 'currentColor',
}: IconPropsType & { strokeColor?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={style}
        >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
        </svg>
    );
};
