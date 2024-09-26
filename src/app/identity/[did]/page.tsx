'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import IdentityCard from '@/components/identity/IdentityCard';

export default function IdentityPage() {
  const { did } = useParams();

  const exampleData = {
    did: did as string,
    claims: 77,
    assets: 4,
    venue: 4,
    portfolios: 2,
    primaryKey: '5FN9LL...M3Ph5c',
    secondaryKeys: ['5GiTy...AYxCBn'],
  };

  return (
    <Box>
      <IdentityCard {...exampleData} />
    </Box>
  );
}
