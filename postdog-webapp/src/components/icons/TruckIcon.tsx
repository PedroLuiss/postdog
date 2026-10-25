import { IconPropsType } from './types/IconsProps.type';

type IconTruckProps = IconPropsType;

export const TruckIcon = ({
  width = 28,
  height = 20,
  className = '',
  style = {},
    fillColor = 'currentColor',
}: IconTruckProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M24.1818 5H20.3636V0H2.54545C1.14545 0 0 1.125 0 2.5V16.25H2.54545C2.54545 18.325 4.25091 20 6.36364 20C8.47636 20 10.1818 18.325 10.1818 16.25H17.8182C17.8182 18.325 19.5236 20 21.6364 20C23.7491 20 25.4545 18.325 25.4545 16.25H28V10L24.1818 5ZM6.36364 18.125C5.30727 18.125 4.45455 17.2875 4.45455 16.25C4.45455 15.2125 5.30727 14.375 6.36364 14.375C7.42 14.375 8.27273 15.2125 8.27273 16.25C8.27273 17.2875 7.42 18.125 6.36364 18.125ZM23.5455 6.875L26.04 10H20.3636V6.875H23.5455ZM21.6364 18.125C20.58 18.125 19.7273 17.2875 19.7273 16.25C19.7273 15.2125 20.58 14.375 21.6364 14.375C22.6927 14.375 23.5455 15.2125 23.5455 16.25C23.5455 17.2875 22.6927 18.125 21.6364 18.125Z"
        fill={fillColor}
      />
    </svg>
  );
};
