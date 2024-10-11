'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useCallbackEventListener } from '@/hooks/common/useCallbackEventListener';
import { NetworkProviderEvents } from '@/domain/events/NetworkProviderEvents';

export default function NotFound() {
  useCallbackEventListener(NetworkProviderEvents.networkChanged, () => {
    // Reload the page when the networkChanged event is emitted
    window.location.reload();
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        We&apos;re sorry, the entity you&apos;re looking for doesn&apos;t exist
        or couldn&apos;t be found.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Return to Home Page
      </Button>
    </Box>
  );
}
