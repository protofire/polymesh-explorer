import React from 'react';
import { Box, Skeleton } from '@mui/material';

export function LoadingAnimation() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="40"
      height="40"
    >
      <style>
        {`
        .hexagon {
          fill: none;
          stroke: #ff1493;
          stroke-width: 4;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .hex1 { animation: pulse 2s ease-in-out infinite; }
        .hex2 { animation: pulse 2s ease-in-out infinite 0.3s; }
        .hex3 { animation: pulse 2s ease-in-out infinite 0.6s; }
      `}
      </style>
      <polygon
        className="hexagon hex1"
        points="100,20 173.2,60 173.2,140 100,180 26.8,140 26.8,60"
      />
      <polygon
        className="hexagon hex2"
        points="100,40 146.6,65 146.6,115 100,140 53.4,115 53.4,65"
      />
      <polygon
        className="hexagon hex3"
        points="100,60 120,70 120,90 100,100 80,90 80,70"
      />
    </svg>
  );
}

export function SearchBarSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        bgcolor: '#121212',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '80%',
          maxWidth: 600,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          p: 1,
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', ml: 2, mr: 2 }}
        />
        <LoadingAnimation />
      </Box>
    </Box>
  );
}
