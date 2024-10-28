'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListAssets } from '@/hooks/asset/useListAssets';
import { AssetTable } from '@/components/asset/AssetTable/AssetTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

export default function AssetPage() {
  const { data, isFetched, error } = useListAssets();
  const isLoading = !isFetched || data === undefined;

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Assets overview
      </Typography>
      {isLoading ? (
        <GenericTableSkeleton columnCount={8} rowCount={10} />
      ) : (
        <AssetTable
          paginatedAssets={data}
          error={error}
          criteriaController={data?.criteriaController}
        />
      )}
    </MainWrapper>
  );
}
