'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { JsonViewer } from '@/components/shared/JsonViewer';

export default function AccountDetailPage() {
  const { key } = useParams();

  return (
    <Box>
      <JsonViewer data={{ key }} />
    </Box>
  );
}
