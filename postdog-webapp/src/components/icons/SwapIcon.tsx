import { IconPropsType } from './types/IconsProps.type';

type SwapIconProps = IconPropsType;

export const SwapIcon = ({
  width = 13,
  height = 20,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: SwapIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M8.35714 13.0265V19.5358H10.2143V13.0265H13L9.28571 9.32148L5.57143 13.0265H8.35714ZM7.42857 7.47362H4.64286V0.964339H2.78571V7.47362H0L3.71429 11.1786L7.42857 7.47362Z"
        fill={fillColor}
      />
    </svg>
  );
};
