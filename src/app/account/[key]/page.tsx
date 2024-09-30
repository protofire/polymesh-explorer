'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { JsonViewer } from '@/components/shared/JsonViewer';
import { useGetAccount } from '@/hooks/account/useGetAccount';

export default function AccountDetailPage() {
  const { key } = useParams();
  const { data } = useGetAccount({ key: key as string });

  return (
    <Box>
      <JsonViewer data={{ ...data }} />
    </Box>
  );
}
