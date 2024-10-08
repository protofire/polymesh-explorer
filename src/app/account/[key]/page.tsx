'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { AccountCard } from '@/components/account/AccountCard';
import { JsonViewer } from '@/components/shared/JsonViewer';
import { useGetAccount } from '@/hooks/account/useGetAccount';

export default function AccountDetailPage() {
  const { key } = useParams();
  const {
    data: account,
    isLoading,
    error,
  } = useGetAccount({ key: key as string });

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!isLoading && account === null) {
    notFound();
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {account && <AccountCard account={account} isLoading={isLoading} />}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Raw Data
          </Typography>
          <JsonViewer data={{ ...account }} />
        </Box>
      </Box>
    </Container>
  );
}
