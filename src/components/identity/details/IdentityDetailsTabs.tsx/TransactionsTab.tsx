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

interface TransactionsTabTableProps {
  paginatedTransactions: PaginatedData<ExtrinsicTransaction[]> | undefined;
  isLoading: boolean;
  subscanUrl: string;
}

export function TransactionsTabTable({
  paginatedTransactions,
  isLoading,
  subscanUrl,
}: TransactionsTabTableProps) {
  if (isLoading || paginatedTransactions === undefined) {
    return <GenericTableSkeleton columnCount={6} rowCount={3} />;
  }

  const { data: transactions, paginationController } = paginatedTransactions;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block</TableCell>
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
              transactions.map((transaction) => (
                <TableRow
                  key={`${transaction.blockId}-${transaction.extrinsicIdx}`}
                >
                  <TableCell>
                    <GenericLink
                      href={`${subscanUrl}/extrinsic/${transaction.blockId}-${transaction.extrinsicIdx}`}
                      tooltipText="See on subscan"
                      isExternal
                    >
                      {transaction.blockId}
                    </GenericLink>
                  </TableCell>
                  <TableCell>
                    <FormattedDate date={transaction.block.datetime} />
                  </TableCell>
                  <TableCell>{transaction.address}</TableCell>
                  <TableCell>{transaction.moduleId}</TableCell>
                  <TableCell>{transaction.callId}</TableCell>
                  <TableCell>{transaction.success ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
