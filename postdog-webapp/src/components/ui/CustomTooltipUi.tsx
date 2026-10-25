import React, { ReactElement } from 'react';
import { Tooltip, tooltipClasses, TooltipProps, Zoom } from '@mui/material';

interface CustomTooltipUiProps {
  title: TooltipProps['title'];
  children: ReactElement;
  placement?: TooltipProps['placement'];
  variant?: 'dark' | 'red';
  className?: string;
}

export const CustomTooltipUi: React.FC<CustomTooltipUiProps> = ({
  title,
  children,
  placement = 'top',
  variant = 'dark',
  className = '',
}) => {
  const isRed = variant === 'red';
  const bgColor = isRed ? '#dc2626' : '#0A0A0A';

  return (
    <Tooltip
      title={
        <div>
          {typeof title === 'string' ? (
            <p style={{
              margin: 0,
              fontSize: '.875rem',
              lineHeight: '1.25rem',
              whiteSpace: 'normal',
              fontWeight: 400,
            }}>
              {title}
            </p>
          ) : (
            title
          )}
        </div>
      }
      placement={placement}
      classes={{
        tooltip: className
      }}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: bgColor,
            color: '#fff',
            maxWidth: 385,
            borderRadius: '6px',
            padding: '6px 12px',
            border: `1px solid ${bgColor}`,
            '& .MuiTooltip-arrow': {
              color: bgColor,
            },
          },
        },
      }}
      slotProps={{
        popper: {
          sx: {
            zIndex: 9999,
            [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
            {
              marginTop: '5px',
            },
            [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
            {
              marginBottom: '5px',
            },
            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
            {
              marginLeft: '2px',
            },
            [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
            {
              marginRight: '2px',
            },
          },
        },
      }}
      slots={{
        transition: Zoom,
      }}
    >
      {children}
    </Tooltip>
  );
};