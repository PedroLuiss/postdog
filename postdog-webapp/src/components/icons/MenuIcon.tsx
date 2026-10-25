import { IconPropsType } from './types/IconsProps.type';

type MenuIconProps = IconPropsType;

export const MenuIcon = ({
  width = 18,
  height = 14,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: MenuIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 14"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M2 8.4H16V5.6H2V8.4ZM0 14H14V11.2H0V14ZM4 0V2.8H18V0H4Z"
        fill={fillColor}
      />
    </svg>
  );
};
