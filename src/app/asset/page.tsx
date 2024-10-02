'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useListAssets } from '@/hooks/asset/useListAssets';
import { AssetTable } from '@/components/asset/AssetTable/AssetTable';

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
    <Box>
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
    </Box>
  );
}
