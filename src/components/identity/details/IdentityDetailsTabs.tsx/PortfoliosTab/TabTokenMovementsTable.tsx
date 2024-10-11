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
  CircularProgress,
} from '@mui/material';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { PaginatedData } from '@/types/pagination';
import { NoDataAvailable } from '@/components/common/NoDataAvailable';

interface TabTokenMovementsTableProps {
  portfolioMovements: PaginatedData<PortfolioMovement> | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
}

export function TabTokenMovementsTable({
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  currentPage,
  pageSize,
  onPageChange,
}: TabTokenMovementsTableProps) {
  if (isLoadingMovements || isFetchingMovements) {
    return <CircularProgress />;
  }

  if (!portfolioMovements?.data.length) {
    return (
      <NoDataAvailable message="No portfolio movements available" colSpan={5} />
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioMovements.data.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.from.name}</TableCell>
                <TableCell>{movement.to.name}</TableCell>
                <TableCell>{movement.assetId}</TableCell>
                <TableCell>{movement.amount}</TableCell>
                <TableCell>
                  {new Date(movement.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
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
