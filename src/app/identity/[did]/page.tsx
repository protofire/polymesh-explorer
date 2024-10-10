'use client';

import React from 'react';
import { Box } from '@mui/material';
import { notFound, useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/details/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';
import { IdentityDetailsTabs } from '@/components/identity/details/IdentityDetailsTabs.tsx';
import { useNetworkProvider } from '@/context/NetworkProvider';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

export default function IdentityPage() {
  const { did } = useParams();
  const { data, isLoading, isFetched } = useGetIdentity({ did: did as string });
  const {
    currentNetworkConfig: { subscanUrl },
  } = useNetworkProvider();

  if (!isLoading && data === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <>
        <IdentityCard
          identityDid={did as string}
          isLoading={!isFetched}
          identity={data}
        />

        {data && (
          <Box mt={3}>
            <IdentityDetailsTabs
              identity={data}
              identityDid={did as string}
              subscanUrl={subscanUrl}
            />
          </Box>
        )}
      </>
    </MainWrapper>
  );
}
