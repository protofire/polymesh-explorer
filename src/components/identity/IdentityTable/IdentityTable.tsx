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
  Tooltip,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { format } from 'date-fns';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Identity } from '@/domain/entities/Identity';
import { PaginatedData } from '@/types/pagination';
import { UseTransactionHistoryAccountsResult } from '@/hooks/identity/useTransactionHistoryAccounts';
import { SkeletonIdentityTable } from './SkeletonIdentityTable';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';

interface IdentityTableProps {
  paginatedIdentities: PaginatedData<Identity>;
  isLoading: boolean;
  error: Error | null;
  isPreviousData: boolean;
  onFirstPage: () => void;
  onNextPage: () => void;
  transactionHistory?: UseTransactionHistoryAccountsResult;
}

export function IdentityTable({
  paginatedIdentities,
  isLoading,
  error,
  isPreviousData,
  onFirstPage,
  onNextPage,
  transactionHistory,
}: IdentityTableProps) {
  if (isLoading) return <SkeletonIdentityTable />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const { data: identities, paginationInfo } = paginatedIdentities;
  const { totalCount, hasNextPage, currentStartIndex } = paginationInfo;

  const startIndex = currentStartIndex;
  const endIndex = Math.min(startIndex + identities.length - 1, totalCount);

  return (
    <Box>
      <Typography variant="h6" gutterBottom mt={2}>
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
              <TableCell>Created At</TableCell>
              <TableCell>Recent Activity</TableCell>
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
                <TableCell>
                  <FormattedDate date={identity.createdAt} />
                </TableCell>
                <TableCell>
                  {transactionHistory &&
                    transactionHistory[identity.did]?.extrinsics?.[0] && (
                      <Tooltip
                        title={format(
                          new Date(
                            transactionHistory[
                              identity.did
                            ].extrinsics[0].block.datetime,
                          ),
                          'PPpp',
                        )}
                      >
                        <Box display="flex" alignItems="center">
                          <Typography>
                            {
                              transactionHistory[identity.did].extrinsics[0]
                                .moduleId
                            }
                          </Typography>
                          {transactionHistory[identity.did].extrinsics[0]
                            .success ? (
                            <CheckCircleIcon
                              color="success"
                              fontSize="small"
                              sx={{ ml: 1 }}
                            />
                          ) : (
                            <CancelIcon
                              color="error"
                              fontSize="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    )}
                </TableCell>
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
