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
  const { venue, isFetched, error } = useGetVenue(venueId as string);

  if (error) {
    return <Typography color="error">Error: {String(error)}</Typography>;
  }

  if (venue === null) {
    notFound();
  }

  return (
    <MainWrapper>
      <VenueCard venue={venue} isLoading={!isFetched} />
      {venue?.id && <VenueDetailsTabs venue={venue} />}
    </MainWrapper>
  );
}
