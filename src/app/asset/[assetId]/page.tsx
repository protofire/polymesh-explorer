'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetAsset } from '@/hooks/asset/useGetAsset';
import { AssetCard } from '@/components/asset/AssetCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { AssetDetailsTabs } from '@/components/asset/details/AssetDetailsTabs';
import { useGetAssetDetails } from '@/hooks/asset/useGetAssetDetails';

export default function AssetPage() {
  const { assetId } = useParams();
  const {
    data: asset,
    isLoading,
    error,
  } = useGetAsset({ assetId: assetId as string });
  const details = useGetAssetDetails(asset);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!isLoading && asset === null) {
    notFound();
  }

  console.log('__details', details);
  return (
    <MainWrapper>
      <AssetCard asset={asset} isLoading={isLoading} />
      {asset && <AssetDetailsTabs asset={asset} />}
    </MainWrapper>
  );
}
