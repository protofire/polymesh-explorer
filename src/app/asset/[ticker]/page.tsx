'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Typography, Box } from '@mui/material';
import { useGetAsset } from '@/hooks/asset/useGetAsset';
import { AssetCard } from '@/components/asset/AssetCard/AssetCard';

export default function AssetPage() {
  const { ticker } = useParams();
  const { data: asset, isLoading, error } = useGetAsset(ticker as string);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Asset Details
      </Typography>
      <AssetCard asset={asset} isLoading={isLoading} />
    </Box>
  );
}
