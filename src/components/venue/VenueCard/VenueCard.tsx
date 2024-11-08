import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Venue } from '@/domain/entities/Venue';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import CopyButton from '@/components/shared/common/CopyButton';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { LoadingSkeletonCard } from '@/components/shared/LoadingSkeletonCard/LoadingSkeletonCard';

interface VenueCardProps {
  venue: Venue | undefined;
  isLoading?: boolean;
}

export function VenueCard({
  venue,
  isLoading,
}: VenueCardProps): React.ReactElement {
  if (venue === undefined || isLoading) {
    return <LoadingSkeletonCard title="Venue Details" />;
  }

  const { id, type, details, ownerId, createdAt } = venue;

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="h4">Venue Details</Typography>
        <DocumentationIconButton polymeshEntity="venue" />
      </Box>

      <Stack spacing={2} mb={2}>
        {/* First row */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Venue ID:
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Typography variant="body1">{id}</Typography>
              <CopyButton text={id} />
            </Box>
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Created At:
            </Typography>
            <FormattedDate date={createdAt} variant="body1" />
          </Box>
        </Stack>

        {/* Second row */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Type:
            </Typography>
            {type ? (
              <Typography variant="body1">{type}</Typography>
            ) : (
              <EmptyDash />
            )}
          </Box>

          <Box flex={1}>
            <Typography variant="body2" color="textSecondary">
              Details:
            </Typography>
            <Typography variant="body1">{details}</Typography>
          </Box>
        </Stack>

        {/* Owner section */}
        <Box flex={1}>
          <Typography variant="body2" color="textSecondary" mb={1}>
            Owner:
          </Typography>
          <AccountOrDidTextField value={ownerId} showIdenticon isIdentity />
        </Box>
      </Stack>
    </>
  );
}
