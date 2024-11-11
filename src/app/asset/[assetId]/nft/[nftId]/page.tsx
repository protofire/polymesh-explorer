'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { useGetNftById } from '@/hooks/asset/non-fungible/useGetNftById';
import { NftDetailsCard } from '@/components/asset/details/nft/NftDetailsCard';
import { useGetAsset } from '@/hooks/asset/useGetAsset';

export default function NftDetailsPage() {
  const { assetId, nftId } = useParams();
  const {
    data: nft,
    isLoading,
    isFetched,
    error,
  } = useGetNftById({
    assetId: assetId as string,
    nftId: nftId as string,
  });
  const {
    data: collection,
    isLoading: isLoadingCollection,
    isFetched: isFetchedCollection,
  } = useGetAsset({
    assetId: assetId as string,
  });

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!isLoading && nft === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <NftDetailsCard
        nft={nft}
        isLoading={!isFetched || isLoading}
        collection={collection}
        isLoadingCollection={!isFetchedCollection || isLoadingCollection}
      />
    </MainWrapper>
  );
}
