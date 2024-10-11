'use client';

import React from 'react';
import { Box } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/details/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';
import { useGetIdentityDetails } from '@/hooks/identity/useGetIdentityDetails';
import { IdentityDetailsTabs } from '@/components/identity/details/IdentityDetailsTabs.tsx';
import { useNetworkProvider } from '@/context/NetworkProvider/useNetworkProvider';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

export default function IdentityPage() {
  const { did } = useParams();
  const {
    data: identity,
    isLoading: identityLoading,
    isFetched,
  } = useGetIdentity({ did: did as string });
  const { data: portfolios, isFetched: portfoliosFetched } =
    useGetIdentityDetails({ identity });
  const {
    currentNetworkConfig: { subscanUrl },
  } = useNetworkProvider();

  if (!identityLoading && identity === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <>
        <IdentityCard
          identityDid={did as string}
          isLoading={!isFetched}
          identity={identity}
        />

        {identity && (
          <Box mt={3}>
            <IdentityDetailsTabs
              identity={identity}
              identityDid={did as string}
              subscanUrl={subscanUrl}
              portfolios={portfolios || []}
              isLoadingPortfolios={!portfoliosFetched}
            />
          </Box>
        )}
      </>
    </MainWrapper>
  );
}
