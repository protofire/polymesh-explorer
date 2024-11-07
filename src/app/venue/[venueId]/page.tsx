'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography } from '@mui/material';
import { useGetVenue } from '@/hooks/venue/useGetVenue';
import { VenueCard } from '@/components/venue/VenueCard/VenueCard';
import { LoadingSkeletonCard } from '@/components/shared/LoadingSkeletonCard/LoadingSkeletonCard';
import { MainWrapper } from '@/components/shared/layout/mainWrapper';

export default function VenueDetailPage() {
  const { venueId } = useParams();
  const { data: venue, isLoading, error } = useGetVenue(venueId as string);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (venue === null) {
    notFound();
  }

  return (
    <MainWrapper>
      {isLoading || venue === undefined ? (
        <LoadingSkeletonCard />
      ) : (
        <VenueCard venue={venue} />
      )}
    </MainWrapper>
  );
}
