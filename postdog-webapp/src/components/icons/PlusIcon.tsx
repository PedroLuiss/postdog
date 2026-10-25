import { IconPropsType } from './types/IconsProps.type';

type PlusIconProps = IconPropsType;

export const PlusIcon = ({
  width = 14,
  height = 14,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: PlusIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}>
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
      <path d="M16 2v4"></path>
      <path d="M8 2v4"></path>
      <path d="M3 10h5"></path>
      <path d="M17.5 17.5 16 16.3V14"></path>
      <circle cx="16" cy="16" r="6"></circle>
    </svg>
  );
};
