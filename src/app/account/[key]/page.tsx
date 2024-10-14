'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { AccountCard } from '@/components/account/AccountCard';
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
      </Box>
    </Container>
  );
}
