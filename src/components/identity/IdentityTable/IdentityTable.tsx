'use client';

import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Identity } from '@/domain/entities/Identity';
import { PaginatedData } from '@/types/pagination';

interface IdentityTableProps {
  paginatedIdentities: PaginatedData<Identity>;
  isLoading: boolean;
  error: Error | null;
  isPreviousData: boolean;
  onFirstPage: () => void;
  onNextPage: () => void;
}

export function IdentityTable({
  paginatedIdentities,
  isLoading,
  error,
  isPreviousData,
  onFirstPage,
  onNextPage,
}: IdentityTableProps) {
  const { data: identities, paginationInfo } = paginatedIdentities;
  const { totalCount, hasNextPage, currentStartIndex } = paginationInfo;

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const startIndex = currentStartIndex;
  const endIndex = Math.min(startIndex + identities.length - 1, totalCount);

  return (
    <Box>
      <Typography variant="h4" gutterBottom mt={2}>
        Identities
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DID</TableCell>
              <TableCell>Primary Account</TableCell>
              <TableCell>Portfolios</TableCell>
              <TableCell>Claims</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identities.map((identity) => (
              <TableRow key={identity.did}>
                <TableCell>
                  <Link href={`${ROUTES.Identity}/${identity.did}`}>
                    {truncateAddress(identity.did)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`${ROUTES.Account}/${identity.primaryAccount}`}>
                    {truncateAddress(identity.primaryAccount)}
                  </Link>
                </TableCell>
                <TableCell>{identity.portfoliosCount}</TableCell>
                <TableCell>{identity.claimsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button onClick={onFirstPage} disabled={currentStartIndex === 1}>
          First page
        </Button>
        <Button onClick={onNextPage} disabled={!hasNextPage || isPreviousData}>
          Next page
        </Button>
      </Box>
      <Typography variant="body2" align="center" mt={1}>
        Showing records {startIndex} - {endIndex} of {totalCount}
      </Typography>
    </Box>
  );
}
