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
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { PaginatedData } from '@/types/pagination';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { PolymeshExplorerLink } from '@/components/shared/ExplorerLink/PolymeshExplorerLink';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';

interface TabTokenMovementsTableProps {
  portfolioMovements: PaginatedData<PortfolioMovement> | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  subscanUrl: string;
}

export function TabTokenMovementsTable({
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  currentPage,
  pageSize,
  onPageChange,
  subscanUrl,
}: TabTokenMovementsTableProps) {
  if (isLoadingMovements || isFetchingMovements || !portfolioMovements) {
    return <GenericTableSkeleton columnCount={7} rowCount={3} />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioMovements?.data.length < 1 ? (
              <NoDataAvailableTBody
                message="No portfolio movements available"
                colSpan={6}
              />
            ) : (
              portfolioMovements.data.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <GenericLink
                      href={`${subscanUrl}/extrinsic/${movement.id.replace('/', '-')}`}
                      tooltipText="See on subscan"
                      isExternal
                    >
                      {movement.id}
                    </GenericLink>
                  </TableCell>
                  <TableCell>
                    <FormattedDate date={movement.createdAt} />
                  </TableCell>
                  <TableCell>{movement.from.name}</TableCell>
                  <TableCell>{movement.to.name}</TableCell>
                  <TableCell>
                    <GenericLink href={`${ROUTES.Asset}/${movement.assetId}`}>
                      {movement.assetId}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{movement.amount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={portfolioMovements.paginationInfo.totalCount}
        page={currentPage - 1}
        onPageChange={onPageChange}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </>
  );
}
