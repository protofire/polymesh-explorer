'use client';

import React from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { useListVenues } from '@/hooks/venue/useListVenues';
import { VenueTable } from '@/components/venue/VenueTable/VenueTable';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';

export default function VenuePage() {
  const { data, isLoading, isFetched, error } = useListVenues();

  const isLoadingData = isLoading || !isFetched;

  return (
    <MainWrapper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4">Venues overview</Typography>
        <GenericLink
          href={`${ROUTES.Venue}/default`}
          tooltipText="Click to view instructions mapped to default venue"
        >
          <Chip
            label="Default Venue"
            size="small"
            color="primary"
            variant="outlined"
            clickable
          />
        </GenericLink>
      </Stack>
      {isLoadingData ? (
        <GenericTableSkeleton columnCount={5} rowCount={10} />
      ) : (
        data && <VenueTable paginatedVenues={data} error={error} />
      )}
    </MainWrapper>
  );
}
