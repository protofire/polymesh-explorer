'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListVenues } from '@/hooks/venue/useListVenues';
import { VenueTable } from '@/components/venue/VenueTable/VenueTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

export default function VenuePage() {
  const { data, isLoading, isFetched, error } = useListVenues();

  const isLoadingData = isLoading || !isFetched;

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Venues overview
      </Typography>
      {isLoadingData ? (
        <GenericTableSkeleton columnCount={5} rowCount={10} />
      ) : (
        data && <VenueTable paginatedVenues={data} error={error} />
      )}
    </MainWrapper>
  );
}
