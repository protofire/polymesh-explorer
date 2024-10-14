import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { PaginatedData } from '@/types/pagination';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

interface TabAssetTransactionsTableProps {
  assetTransactions: PaginatedData<PortfolioMovement> | undefined;
  isLoadingTransactions: boolean;
  isFetchingTransactions: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
}

export function TabAssetTransactionsTable({
  assetTransactions,
  isLoadingTransactions,
  isFetchingTransactions,
  currentPage,
  pageSize,
  onPageChange,
}: TabAssetTransactionsTableProps) {
  if (isLoadingTransactions || isFetchingTransactions) {
    return <GenericTableSkeleton columnCount={6} rowCount={3} />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetTransactions?.data && assetTransactions.data.length > 0 ? (
              assetTransactions.data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.assetId}</TableCell>
                  <TableCell>
                    {transaction.from?.name || transaction.fromId}
                  </TableCell>
                  <TableCell>
                    {transaction.to?.name || transaction.toId}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    {/* {new Date(
                      transaction.createdBlock.datetime,
                    ).toLocaleString()} */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={5}
                message="No transactions available for this portfolio"
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {assetTransactions?.paginationInfo && (
        <TablePagination
          component="div"
          count={assetTransactions.paginationInfo.totalCount}
          page={currentPage - 1}
          onPageChange={onPageChange}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[pageSize]}
        />
      )}
    </>
  );
}
