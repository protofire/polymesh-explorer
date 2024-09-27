'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { IdentityCard } from '@/components/identity/IdentityCard';
import { useGetIdentity } from '@/hooks/identity/useGetIdentity';

export default function IdentityPage() {
  const { did } = useParams();
  const { data } = useGetIdentity({ did: did as string });

  return (
    <Box>
      <IdentityCard
        did={did as string}
        claims={data?.claimsCount || 0}
        assets={data?.assetsCount || 0}
        venue={4}
        portfolios={2}
        primaryKey="5FN9LL...M3Ph5c"
        secondaryKeys={['5GiTy...AYxCBn']}
      />
    </Box>
  );
}
