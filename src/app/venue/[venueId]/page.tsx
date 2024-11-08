'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetVenue } from '@/hooks/venue/useGetVenue';
import { VenueCard } from '@/components/venue/VenueCard/VenueCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';
import { VenueDetailsTabs } from '@/components/venue/VenueDetailsTabs';

export default function VenueDetailPage() {
  const { venueId } = useParams();
  const { venueDetails, status, error } = useGetVenue(venueId as string);

  if (error.getVenueError) {
    return (
      <Typography color="error">
        Error: {String(error.getVenueError)}
      </Typography>
    );
  }

  if (venueDetails === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <VenueCard venue={venueDetails} isLoading={!status.isFetchedVenue} />
      {venueDetails?.id && (
        <VenueDetailsTabs venue={venueDetails} error={error} status={status} />
      )}
    </MainWrapper>
  );
}
