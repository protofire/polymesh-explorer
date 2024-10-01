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

interface Identity {
  did: string;
  primaryAccount: string;
  portfoliosCount: number;
  claimsCount: number;
  recentActivity: {
    module: string;
    call: string;
    success: boolean;
  } | null;
  isCustodian: boolean;
}

interface IdentityTableProps {
  identities: Identity[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isPreviousData: boolean;
  onFirstPage: () => void;
  onNextPage: () => void;
  cursor: string | undefined;
}

export function IdentityTable({
  identities,
  isLoading,
  error,
  hasNextPage,
  isPreviousData,
  onFirstPage,
  onNextPage,
  cursor,
}: IdentityTableProps) {
  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Identity List
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
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={onFirstPage} disabled={!cursor}>
          First page
        </Button>
        <Button onClick={onNextPage} disabled={!hasNextPage || isPreviousData}>
          Next page
        </Button>
      </Box>
    </Box>
  );
}
