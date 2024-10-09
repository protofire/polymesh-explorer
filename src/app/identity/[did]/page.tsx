'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/details/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';
import { IdentityDetailsTabs } from '@/components/identity/details/IdentityDetailsTabs.tsx';
import { useNetworkProvider } from '@/context/NetworkProvider';

export default function IdentityPage() {
  const { did } = useParams();
  const { data, isLoading } = useGetIdentity({ did: did as string });
  const {
    currentNetworkConfig: { subscanUrl },
  } = useNetworkProvider();

  return (
    <Box>
      {data && (
        <>
          <IdentityCard
            identityDid={did as string}
            isLoading={isLoading}
            identity={data}
          />

          <Box mt={3}>
            <IdentityDetailsTabs
              identity={data}
              identityDid={did as string}
              subscanUrl={subscanUrl}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
