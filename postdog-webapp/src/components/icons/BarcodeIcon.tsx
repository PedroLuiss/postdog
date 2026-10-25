import { IconPropsType } from './types/IconsProps.type';

type BarcodeIconProps = IconPropsType;

export const BarcodeIcon = ({
  width = 17,
  height = 19,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: BarcodeIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 17 19"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M14.1667 14.25H2.83333V12.35H14.1667V14.25ZM14.1667 10.45H2.83333V8.55H14.1667V10.45ZM14.1667 6.65H2.83333V4.75H14.1667V6.65ZM0 19L1.41667 17.575L2.83333 19L4.25 17.575L5.66667 19L7.08333 17.575L8.5 19L9.91667 17.575L11.3333 19L12.75 17.575L14.1667 19L15.5833 17.575L17 19V0L15.5833 1.425L14.1667 0L12.75 1.425L11.3333 0L9.91667 1.425L8.5 0L7.08333 1.425L5.66667 0L4.25 1.425L2.83333 0L1.41667 1.425L0 0V19Z"
        fill={fillColor}
      />
    </svg>
  );
};
