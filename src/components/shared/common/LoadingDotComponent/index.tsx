import React from 'react';
import { Box, BoxProps, keyframes } from '@mui/material';

const pulse = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`;

interface LoadingDotProps extends BoxProps {
  color?: string;
}

export function LoadingDot({
  color = 'primary.main',
  ...props
}: LoadingDotProps): React.ReactElement {
  return (
    <Box
      component="span"
      sx={{
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        display: 'inline-block',
        bgcolor: color,
        animation: `${pulse} 1s infinite ease-in-out`,
        position: 'absolute',
        top: -2,
        right: -6,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}
