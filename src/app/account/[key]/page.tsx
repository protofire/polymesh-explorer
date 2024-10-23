'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { useGetAccount } from '@/hooks/account/useGetAccount';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';
import { AccountDetailsTabs } from '@/components/account/details/AccountDetailsTabs';
import { AccountCard } from '@/components/account/AccountCard';

export default function AccountDetailPage() {
  const { currentNetworkConfig } = useNetworkProvider();
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
    return notFound();
  }

  return (
    <MainWrapper>
      <>
        <AccountCard account={account} isLoading={isLoading} />

        {account && currentNetworkConfig && (
          <Box mt={3}>
            <AccountDetailsTabs
              account={account}
              subscanUrl={currentNetworkConfig.subscanUrl}
            />
          </Box>
        )}
      </>
    </MainWrapper>
  );
}
