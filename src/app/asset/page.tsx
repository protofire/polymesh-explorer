'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListAssets } from '@/hooks/asset/useListAssets';
import { AssetTable } from '@/components/asset/AssetTable/AssetTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

const PAGE_SIZE = 10;

export default function AssetPage() {
  const { data, isLoading, error } = useListAssets(PAGE_SIZE);

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Assets overview
      </Typography>
      {data && (
        <AssetTable
          paginatedAssets={data}
          isLoading={isLoading}
          error={error}
        />
      )}
    </MainWrapper>
  );
}
