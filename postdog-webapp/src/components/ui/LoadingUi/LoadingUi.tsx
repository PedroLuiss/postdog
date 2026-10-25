import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface LoadingUiProps {
  fullScreen?: boolean;
  bg?: string;
  size?: number | string;
  color?: string;
  thickness?: number;
  zIndex?: number;
  sx?: SxProps<Theme>;
}

const LoadingUi: React.FC<LoadingUiProps> = ({
  fullScreen = false,
  bg = 'rgba(255, 255, 255, 0.8)',
  size = 40,
  color = '#373737',
  thickness = 4,
  zIndex = 9999,
  sx
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        zIndex: zIndex,
        backgroundColor: bg,
        borderRadius: 'inherit',
        ...sx
      }}
    >
      <CircularProgress
        variant="indeterminate"
        size={size}
        thickness={thickness}
        sx={{ color: color }}
      />
    </Box>
  );
};

export default LoadingUi;