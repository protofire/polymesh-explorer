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
  Tooltip,
  Skeleton,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Identity } from '@/domain/entities/Identity';
import { UseTransactionHistoryAccountsResult } from '@/hooks/identity/useTransactionHistoryAccounts';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface IdentityTableProps {
  paginatedIdentities: PaginatedData<Identity[]>;
  error: Error | null;
  transactionHistory?: UseTransactionHistoryAccountsResult;
  isTransactionHistoryFetched?: boolean;
}

export function IdentityTable({
  paginatedIdentities,
  error,
  transactionHistory,
  isTransactionHistoryFetched,
}: IdentityTableProps) {
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  const { data: identities, paginationController } = paginatedIdentities;

  return (
    <Box>
      <Typography variant="h6" gutterBottom mt={2}>
        Identities
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="15%">DID</TableCell>
              <TableCell width="15%">Primary Account</TableCell>
              <TableCell width="10%">Portfolios</TableCell>
              <TableCell width="10%">Claims</TableCell>
              <TableCell width="10%">Custodied Portfolios</TableCell>
              <TableCell width="15%">Created At</TableCell>
              <TableCell width="25%">Recent Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identities.map((identity) => (
              <TableRow key={identity.did}>
                <TableCell>
                  <GenericLink
                    href={`${ROUTES.Identity}/${identity.did}`}
                    tooltipText="Go to Identity"
                  >
                    {truncateAddress(identity.did, 5)}
                  </GenericLink>
                </TableCell>
                <TableCell>
                  <GenericLink
                    href={`${ROUTES.Account}/${identity.primaryAccount}`}
                    tooltipText="Go to Account"
                  >
                    {truncateAddress(identity.primaryAccount, 5)}
                  </GenericLink>
                </TableCell>
                <TableCell>{identity.portfoliosCount}</TableCell>
                <TableCell>{identity.claimsCount}</TableCell>
                <TableCell>{identity.custodiedPortfoliosCount}</TableCell>
                <TableCell>
                  <FormattedDate date={identity.createdAt} />
                </TableCell>
                <TableCell>
                  {!isTransactionHistoryFetched ? (
                    <Skeleton variant="text" width={100} animation="wave" />
                  ) : (
                    transactionHistory?.[identity.did]?.extrinsics?.[0] && (
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
                          <Typography noWrap>
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
                    )
                  )}
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
