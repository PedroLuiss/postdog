import { IconPropsType } from './types/IconsProps.type';

type BuildingIconProps = IconPropsType;

export const BuildingIcon = ({
  width = 18,
  height = 18,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: BuildingIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M14.1562 2.625L13.125 1.5L12.0938 2.625L11.0625 1.5L10.0312 2.625L9 1.5L7.96875 2.625L6.9375 1.5L5.90625 2.625L4.875 1.5V12H2.8125V14.25C2.8125 15.495 3.73375 16.5 4.875 16.5H13.125C14.2662 16.5 15.1875 15.495 15.1875 14.25V1.5L14.1562 2.625ZM13.8125 14.25C13.8125 14.6625 13.5031 15 13.125 15C12.7469 15 12.4375 14.6625 12.4375 14.25V12H6.25V3.75H13.8125V14.25Z"
        fill={fillColor}
      />
      <path
        d="M6.9375 5.25H11.0625V6.75H6.9375V5.25ZM11.75 5.25H13.125V6.75H11.75V5.25ZM6.9375 7.5H11.0625V9H6.9375V7.5ZM11.75 7.5H13.125V9H11.75V7.5Z"
        fill={fillColor}
      />
    </svg>
  );
};
