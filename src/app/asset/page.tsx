'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListAssets } from '@/hooks/asset/useListAssets';
import { AssetTable } from '@/components/asset/AssetTable/AssetTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

const PAGE_SIZE = 10;

export default function AssetPage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const { data, isLoading, error, isFetching } = useListAssets({
    pageSize: PAGE_SIZE,
    cursor,
  });

  const handleFirstPage = () => setCursor(undefined);
  const handleNextPage = () => setCursor(data?.endCursor);

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Assets overview
      </Typography>
      <AssetTable
        assets={data?.assets || []}
        isLoading={isLoading}
        error={error}
        hasNextPage={data?.hasNextPage || false}
        isPreviousData={isFetching}
        onFirstPage={handleFirstPage}
        onNextPage={handleNextPage}
        cursor={cursor}
      />
    </MainWrapper>
  );
}
