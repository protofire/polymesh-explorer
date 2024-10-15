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
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { FormattedDate } from '@/components/shared/common/FormattedDateText';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface TabTokenMovementsTableProps {
  portfolioMovements: PaginatedData<PortfolioMovement[]> | undefined;
  isLoadingMovements: boolean;
  isFetchingMovements: boolean;
  subscanUrl: string;
}

export function TabTokenMovementsTable({
  portfolioMovements,
  isLoadingMovements,
  isFetchingMovements,
  subscanUrl,
}: TabTokenMovementsTableProps) {
  if (isLoadingMovements || isFetchingMovements || !portfolioMovements) {
    return <GenericTableSkeleton columnCount={7} rowCount={3} />;
  }

  const { data: movements, paginationController } = portfolioMovements;

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
            {movements.length < 1 ? (
              <NoDataAvailableTBody
                message="No portfolio movements available"
                colSpan={6}
              />
            ) : (
              movements.map((movement) => (
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
                    <GenericLink
                      href={`${ROUTES.Asset}/${movement.assetTicker}`}
                    >
                      {movement.assetTicker}
                    </GenericLink>
                  </TableCell>
                  <TableCell>{movement.amount}</TableCell>
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
