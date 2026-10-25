import { IconPropsType } from './types/IconsProps.type';

type CloseIconProps = IconPropsType;

export const CloseIcon = ({
  width = 16,
  height = 16,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: CloseIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={fillColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}>
      <path
        d="M18 6 6 18">
      </path>
      <path
        d="m6 6 12 12">
      </path>
    </svg>
  );
};
