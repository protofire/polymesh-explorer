import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Venue } from '@/domain/entities/Venue';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';

interface VenueTableProps {
  venues: Venue[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isPreviousData: boolean;
  onFirstPage: () => void;
  onNextPage: () => void;
  cursor: string | undefined;
}

export function VenueTable({
  venues,
  isLoading,
  error,
  hasNextPage,
  isPreviousData,
  onFirstPage,
  onNextPage,
  cursor,
}: VenueTableProps) {
  if (isLoading) return <Typography>Loading</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>type</TableCell>
              <TableCell>details</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>
                  <Link href={`${ROUTES.Venue}/${venue.id}`}>{venue.id}</Link>
                </TableCell>
                <TableCell>{venue.type}</TableCell>
                <TableCell>{venue.details}</TableCell>
                <TableCell>
                  <Link href={`${ROUTES.Identity}/${venue.ownerId}`}>
                    {truncateAddress(venue.ownerId)}
                  </Link>
                </TableCell>
                <TableCell>{venue.createdAt.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={onFirstPage} disabled={!cursor}>
          First Page
        </Button>
        <Button onClick={onNextPage} disabled={isPreviousData || !hasNextPage}>
          Next Page
        </Button>
      </Box>
    </Box>
  );
}
