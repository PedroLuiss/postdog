import { IconPropsType } from './types/IconsProps.type';

type ArrowUpIconProps = IconPropsType;

export const ArrowUpIcon = ({
  width = 16,
  height = 16,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: ArrowUpIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill={fillColor}
      className={className}
      style={style}
    >
      <path
        fillRule="evenodd"
        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
      />
    </svg>
  );
};
