'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { Typography, Box } from '@mui/material';
import { useGetVenue } from '@/hooks/venue/useGetVenue';
import { VenueCard } from '@/components/venue/VenueCard/VenueCard';
import { LoadingSkeletonCard } from '@/components/shared/LoadingSkeletonCard/LoadingSkeletonCard';

export default function VenueDetailPage() {
  const { id } = useParams();
  const { data: venue, isLoading, error } = useGetVenue(id as string);

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (venue === null) {
    notFound();
  }

  return (
    <Box>
      {isLoading || venue === undefined ? (
        <LoadingSkeletonCard />
      ) : (
        <VenueCard venue={venue} />
      )}
    </Box>
  );
}
