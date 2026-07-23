import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import CopyButton from '@/components/shared/common/CopyButton';
import { EmptyDash } from '@/components/shared/common/EmptyDash';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';
import { LoadingSkeletonCard } from '@/components/shared/LoadingSkeletonCard/LoadingSkeletonCard';
import { DEFAULT_VENUE_ID, Venue } from '@/domain/entities/Venue';

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
        <Typography variant="h4">
          {id === DEFAULT_VENUE_ID ? 'Default Venue Details' : 'Venue Details'}
        </Typography>
        <DocumentationIconButton polymeshEntity="venue" />
      </Box>

      {id === DEFAULT_VENUE_ID ? (
        <Typography variant="body1" color="textSecondary">
          The default venue is used for settlement instructions that are not
          assigned to a custom venue.
        </Typography>
      ) : (
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
              {details ? (
                <Typography variant="body1">{details}</Typography>
              ) : (
                <EmptyDash />
              )}
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
      )}
    </>
  );
}
