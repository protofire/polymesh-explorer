import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { Venue } from '@/domain/entities/Venue';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';

interface VenueCardProps {
  venue: Venue;
  isLoading?: boolean;
}

export function VenueCard({
  venue,
  isLoading,
}: VenueCardProps): React.ReactElement {
  const { id, type, details, ownerId, createdAt } = venue;

  const renderValue = (value: string | number | Date | undefined) =>
    value === undefined || isLoading ? (
      <Skeleton width="100%" />
    ) : (
      String(value)
    );

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="h4">Venue Details</Typography>
          <DocumentationIconButton polymeshEntity="venue" />
        </Box>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              ID:
            </Typography>
            <Typography variant="body1">{renderValue(id)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Type:
            </Typography>
            <Typography variant="body1">{renderValue(type)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Details:
            </Typography>
            <Typography variant="body1">{renderValue(details)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Owner:
            </Typography>
            {isLoading ? (
              <Skeleton width="100%" />
            ) : (
              <Link href={`${ROUTES.Identity}/${ownerId}`}>
                <Typography variant="body1">
                  {truncateAddress(ownerId)}
                </Typography>
              </Link>
            )}
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Created At:
            </Typography>
            <Typography variant="body1">
              {isLoading ? (
                <Skeleton width="100%" />
              ) : (
                createdAt.toLocaleString()
              )}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
