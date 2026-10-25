import { IconPropsType } from './types/IconsProps.type';

type CardIconProps = IconPropsType;

export const CardIcon = ({
  width = 33,
  height = 26,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: CardIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M29.7 0H3.3C1.4685 0 0.0165 1.44625 0.0165 3.25L0 22.75C0 24.5537 1.4685 26 3.3 26H29.7C31.5315 26 33 24.5537 33 22.75V3.25C33 1.44625 31.5315 0 29.7 0ZM29.7 22.75H3.3V13H29.7V22.75ZM29.7 6.5H3.3V3.25H29.7V6.5Z"
        fill={fillColor}
      />
    </svg>
  );
};
