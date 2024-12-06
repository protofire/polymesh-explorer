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
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface ChildIdentitiesTabProps {
  childIdentities: string[];
}

const getItemNumber = (
  currentPage: number,
  pageSize: number,
  index: number,
): number => {
  return (currentPage - 1) * pageSize + index + 1;
};

export function ChildIdentitiesTab({
  childIdentities,
}: ChildIdentitiesTabProps) {
  const { paginatedItems: paginatedChildren, ...paginationController } =
    useLocalPagination(childIdentities);

  return (
    <>
      <TableContainer component={Paper} sx={{ minHeight: '15rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="10%">#</TableCell>
              <TableCell>Child Identity DID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedChildren.length > 0 ? (
              paginatedChildren.map((childDid, index) => (
                <TableRow key={childDid}>
                  <TableCell>
                    {getItemNumber(
                      paginationController.paginationInfo.currentPage,
                      paginationController.paginationInfo.pageSize,
                      index,
                    )}
                  </TableCell>
                  <TableCell>
                    <AccountOrDidTextField
                      value={childDid}
                      isIdentity
                      showIdenticon
                      sideLength={6}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataAvailableTBody colSpan={2} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
