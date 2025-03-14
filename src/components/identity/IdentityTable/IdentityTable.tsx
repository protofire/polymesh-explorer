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
  Skeleton,
} from '@mui/material';
import { truncateAddress } from '@/services/polymesh/address';
import { ROUTES } from '@/config/routes';
import { Identity } from '@/domain/entities/Identity';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { UseTransactionHistoryDidsAccountsResult } from '@/hooks/identity/useTransactionHistoryDidsAccounts';
import { TransactionHistoryField } from './TransactionHistoryField';
import { ExportCsvButton } from '@/components/shared/ExportCsvButton';
import { CsvExporter } from '@/services/csv/CsvExporter';
import { IdentityCsvExportService } from '@/domain/services/exports/IdentityCsvExportService';

interface IdentityTableProps {
  paginatedIdentities: PaginatedData<Identity[]>;
  error: Error | null;
  transactionHistory?: UseTransactionHistoryDidsAccountsResult;
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

  const handleExport = () => {
    const csvExporter = new CsvExporter<Identity>(
      IdentityCsvExportService.getIdentityColumns(),
    );
    const exportService = new IdentityCsvExportService(csvExporter);
    exportService.exportIdentities(identities);
  };

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
                    <TransactionHistoryField
                      transaction={
                        transactionHistory?.[identity.did]?.extrinsics?.[0]
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        paginationController={paginationController}
        leftActions={
          <ExportCsvButton
            onExport={handleExport}
            disabled={identities.length === 0}
          />
        }
      />
    </Box>
  );
}
