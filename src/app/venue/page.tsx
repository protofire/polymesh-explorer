'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useListVenues } from '@/hooks/venue/useListVenues';
import { VenueTable } from '@/components/venue/VenueTable/VenueTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

const PAGE_SIZE = 10;

export default function VenuePage() {
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const { data, isLoading, error, isFetching } = useListVenues({
    pageSize: PAGE_SIZE,
    cursor,
  });

  const handleFirstPage = () => setCursor(undefined);
  const handleNextPage = () => setCursor(data?.endCursor);

  return (
    <MainWrapper>
      <Typography variant="h4" mb={2}>
        Venues overview
      </Typography>
      <VenueTable
        venues={data?.venues || []}
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
