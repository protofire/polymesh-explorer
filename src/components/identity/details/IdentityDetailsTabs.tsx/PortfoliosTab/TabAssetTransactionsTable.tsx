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
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { truncateAddress } from '@/services/polymesh/address';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';

interface TabAssetTransactionsTableProps {
  assetTransactions: PaginatedData<AssetTransaction> | undefined;
  isLoadingTransactions: boolean;
  isFetchingTransactions: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  subscanUrl: string;
}

export function TabAssetTransactionsTable({
  assetTransactions,
  isLoadingTransactions,
  isFetchingTransactions,
  currentPage,
  pageSize,
  onPageChange,
  subscanUrl,
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
              <TableCell>Instruction</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetTransactions?.data && assetTransactions.data.length > 0 ? (
              assetTransactions.data.map((transaction) => {
                const fromDid = transaction.fromId?.split('/')[0] || '';
                const toDid = transaction.toId?.split('/')[0] || '';

                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <GenericLink
                        href={`${subscanUrl}/block/${transaction.createdBlock.blockId}?tab=event&event=${transaction.id.replace('/', '-')}`}
                        tooltipText="See on subscan"
                        isExternal
                      >
                        {transaction.instructionId}
                      </GenericLink>
                    </TableCell>
                    <TableCell>
                      <FormattedDate date={transaction.createdBlock.datetime} />
                    </TableCell>
                    <TableCell>
                      <GenericLink
                        href={`${ROUTES.Asset}/${transaction.assetId}`}
                      >
                        {transaction.assetId}
                      </GenericLink>
                    </TableCell>
                    <TableCell>
                      {transaction.from?.name || (
                        <GenericLink href={`${ROUTES.Identity}/${fromDid}`}>
                          {truncateAddress(fromDid, 5)}
                        </GenericLink>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.to?.name || (
                        <GenericLink href={`${ROUTES.Identity}/${toDid}`}>
                          {truncateAddress(toDid, 5)}
                        </GenericLink>
                      )}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <NoDataAvailableTBody
                colSpan={6}
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
