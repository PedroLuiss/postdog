import { IconPropsType } from './types/IconsProps.type';

type AlertIconProps = IconPropsType;

export const AlertIcon = ({
  width = 16,
  height = 17,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: AlertIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M8 0.5C3.584 0.5 0 4.084 0 8.5C0 12.916 3.584 16.5 8 16.5C12.416 16.5 16 12.916 16 8.5C16 4.084 12.416 0.5 8 0.5ZM8.8 12.5H7.2V7.7H8.8V12.5ZM8.8 6.1H7.2V4.5H8.8V6.1Z"
        fill={fillColor}
      />
    </svg>
  );
};
