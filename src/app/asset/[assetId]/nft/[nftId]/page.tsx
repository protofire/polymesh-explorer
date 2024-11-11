'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { useGetNftById } from '@/hooks/asset/non-fungible/useGetNftById';
import { NftDetailsCard } from '@/components/asset/details/nft/NftDetailsCard';

export default function NftDetailsPage() {
  const { assetId, nftId } = useParams();
  const {
    data: nft,
    isLoading,
    error,
  } = useGetNftById({
    assetId: assetId as string,
    nftId: nftId as string,
  });

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!isLoading && nft === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <NftDetailsCard nft={nft} isLoading={isLoading} />
    </MainWrapper>
  );
}
