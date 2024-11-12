import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ExtrinsicTransaction } from '@/domain/entities/ExtrinsicTransaction';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { ROUTES } from '@/config/routes';
import { truncateAddress } from '@/services/polymesh/address';
import { CheckBooleanField } from '@/components/shared/fieldAttributes/CheckBooleanField';
import { ExportCsvButton } from '@/components/shared/ExportCsvButton';
import { CsvExporter } from '@/services/csv/CsvExporter';
import { TransactionHistoryCsvExportService } from '@/domain/services/exports/TransactionHistoryCsvExportService';

interface HistoryTransactionsTabTableProps {
  paginatedTransactions: PaginatedData<ExtrinsicTransaction[]> | undefined;
  isLoading: boolean;
  subscanUrl: string;
  did: string;
}

export function HistoryTransactionsTabTable({
  paginatedTransactions,
  isLoading,
  subscanUrl,
  did,
}: HistoryTransactionsTabTableProps) {
  if (isLoading || paginatedTransactions === undefined) {
    return <GenericTableSkeleton columnCount={6} rowCount={3} />;
  }

  const { data: transactions, paginationController } = paginatedTransactions;

  const handleExport = () => {
    const csvExporter = new CsvExporter<ExtrinsicTransaction>(
      TransactionHistoryCsvExportService.getTransactionColumns(),
    );
    const exportService = new TransactionHistoryCsvExportService(csvExporter);
    exportService.exportTransactions(transactions, did);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Call</TableCell>
              <TableCell>Success</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length < 1 ? (
              <NoDataAvailableTBody
                message="No transactions available"
                colSpan={6}
              />
            ) : (
              transactions.map((transaction) => {
                const extrinsic = `${transaction.blockId}-${transaction.extrinsicIdx}`;

                return (
                  <TableRow key={extrinsic}>
                    <TableCell>
                      <FormattedDate date={transaction.block.datetime} />
                    </TableCell>
                    <TableCell>
                      <GenericLink
                        href={`${ROUTES.Account}/${transaction.address}`}
                      >
                        {truncateAddress(transaction.address, 5)}
                      </GenericLink>
                    </TableCell>
                    <TableCell>{transaction.moduleId}</TableCell>
                    <TableCell>
                      <GenericLink
                        href={`${subscanUrl}/extrinsic/${extrinsic}`}
                        tooltipText={`See extrinsic ${extrinsic} on subscan`}
                        isExternal
                      >
                        {transaction.callId}
                      </GenericLink>
                    </TableCell>
                    <TableCell>
                      <CheckBooleanField value={transaction.success} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter
        paginationController={paginationController}
        leftActions={
          <ExportCsvButton
            onExport={handleExport}
            disabled={transactions.length === 0}
          />
        }
      />
    </>
  );
}
