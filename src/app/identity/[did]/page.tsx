'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';

export default function IdentityPage() {
  const { did } = useParams();
  const { data, isLoading } = useGetIdentity({ did: did as string });

  return (
    <Box>
      {data && (
        <IdentityCard
          identityDid={did as string}
          isLoading={isLoading}
          identity={data}
        />
      )}
    </Box>
  );
}
