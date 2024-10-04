'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useListVenues } from '@/hooks/venue/useListVenues';
import { VenueTable } from '@/components/venue/VenueTable/VenueTable';

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
    <Box>
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
    </Box>
  );
}
