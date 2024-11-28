'use client';

import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    reset();
    router.refresh();
  }, [reset, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: '#fff',
        height: '100vh',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ff6f61', mb: 2 }} />
      <Typography variant="h5">
        Something went wrong while loading this page
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.message}
      </Typography>
      <Button
        variant="contained"
        onClick={reset}
        sx={{
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        Try again
      </Button>
    </Box>
  );
}
