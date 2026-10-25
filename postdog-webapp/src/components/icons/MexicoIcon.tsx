import { IconPropsType } from './types/IconsProps.type';

type MexicoIconProps = IconPropsType;

export const MexicoIcon = ({
    width = 24,
    height = 18,
    className = '',
    style = {},
    fillColor = 'currentColor',
}: MexicoIconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
        >
            {/* Colores internos fijos */}
            <path d="M22.9998 2.03224V15.9675C22.9998 16.2412..." fill="#E21743" />
            <path d="M7.03247 1V16.9997H16.968V1H7.03247Z..." fill="#EEF2FA" />
            <path d="M7.03226 8.74179V16.9997H2.41936C2.04292..." fill="#009E60" />
            {/* ...otros <path> con fill fijo omitidos por brevedad... */}

            {/* Trazos personalizables */}
            <path
                d="M7.03247 15.7094V16.9997M7.03247 1V15.1933..."
                stroke={fillColor}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <path
                d="M9.87464 7.70692C9.9758 7.56218 10.1266..."
                stroke={fillColor}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <path
                d="M11.6454 7.19397C11.6434 7.12579 11.6604..."
                stroke={fillColor}
                strokeWidth={2}
                strokeLinejoin="round"
            />
            <path
                d="M20.1613 16.9997H2.41935C2.04292 16.9997..."
                stroke={fillColor}
                strokeWidth={2}
                strokeLinejoin="round"
            />
        </svg>
    );
};
