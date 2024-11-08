/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
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
        Sorry, the account you are looking for seems no valid account address.
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
