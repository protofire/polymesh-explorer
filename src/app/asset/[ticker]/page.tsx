'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetAsset } from '@/hooks/asset/useGetAsset';
import { AssetCard } from '@/components/asset/AssetCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

export default function AssetPage() {
  const { ticker } = useParams();
  const { data: asset, isLoading, error } = useGetAsset(ticker as string);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!isLoading && asset === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <AssetCard asset={asset} isLoading={isLoading} />
    </MainWrapper>
  );
}
