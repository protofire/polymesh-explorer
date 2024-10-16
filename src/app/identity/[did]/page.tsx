'use client';

import React from 'react';
import { Box } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/details/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';
import { useGetIdentityPortfolios } from '@/hooks/identity/useGetIdentityPortfolios';
import { IdentityDetailsTabs } from '@/components/identity/details/IdentityDetailsTabs.tsx';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { useTransactionHistoryAccounts } from '@/hooks/identity/useTransactionHistoryAccounts';

export default function IdentityPage() {
  const { did: identityDid } = useParams();
  const {
    data: identity,
    isLoading: identityLoading,
    isFetched,
  } = useGetIdentity({ identityDid: identityDid as string });
  const { data: portfolios, isFetched: portfoliosFetched } =
    useGetIdentityPortfolios({ identity });
  const { currentNetworkConfig } = useNetworkProvider();

  const { data: transactionData, isFetched: isTransactionDataFetched } =
    useTransactionHistoryAccounts({ identity });

  if (!identityLoading && identity === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <>
        <IdentityCard
          identityDid={identityDid as string}
          isLoading={!isFetched}
          identity={identity}
        />

        {identity && currentNetworkConfig && (
          <Box mt={3}>
            <IdentityDetailsTabs
              identity={identity}
              subscanUrl={currentNetworkConfig.subscanUrl}
              portfolios={portfolios || []}
              isLoadingPortfolios={!portfoliosFetched}
              paginatedTransactions={transactionData}
              isLoadingTransactions={!isTransactionDataFetched}
            />
          </Box>
        )}
      </>
    </MainWrapper>
  );
}
