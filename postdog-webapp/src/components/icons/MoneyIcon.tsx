import { IconPropsType } from './types/IconsProps.type';

type MoneyIconProps = IconPropsType;

export const MoneyIcon = ({
  width = 12,
  height = 21,
  className = '',
  style = {},
  fillColor = 'currentColor',
}: MoneyIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M6.45972 9.21667C3.78389 8.52833 2.92338 7.81667 2.92338 6.70833C2.92338 5.43667 4.11395 4.55 6.10609 4.55C8.20432 4.55 8.98232 5.54167 9.05304 7H11.6582C11.5756 4.99333 10.3379 3.15 7.87426 2.555V0H4.33792V2.52C2.05108 3.01 0.212181 4.48 0.212181 6.73167C0.212181 9.42667 2.46365 10.7683 5.75246 11.55C8.69941 12.25 9.2888 13.2767 9.2888 14.3617C9.2888 15.1667 8.7112 16.45 6.10609 16.45C3.6778 16.45 2.72299 15.3767 2.59332 14H0C0.141454 16.555 2.07466 17.99 4.33792 18.4683V21H7.87426V18.4917C10.1729 18.06 12 16.7417 12 14.35C12 11.0367 9.13556 9.905 6.45972 9.21667Z"
        fill={fillColor}
      />
    </svg>
  );
};
