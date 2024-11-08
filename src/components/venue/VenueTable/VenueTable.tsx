import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { Venue } from '@/domain/entities/Venue';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';

interface VenueTableProps {
  paginatedVenues: PaginatedData<Venue[]>;
  error: Error | null;
}

export function VenueTable({ paginatedVenues, error }: VenueTableProps) {
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const { data: venues, paginationController } = paginatedVenues;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>
                  <GenericLink href={`${ROUTES.Venue}/${venue.id}`}>
                    {venue.id}
                  </GenericLink>
                </TableCell>
                <TableCell>{venue.type}</TableCell>
                <TableCell>{venue.details}</TableCell>
                <TableCell>
                  <GenericLink href={`${ROUTES.Identity}/${venue.ownerId}`}>
                    {truncateAddress(venue.ownerId)}
                  </GenericLink>
                </TableCell>
                <TableCell>
                  <FormattedDate date={venue.createdAt} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </Box>
  );
}
