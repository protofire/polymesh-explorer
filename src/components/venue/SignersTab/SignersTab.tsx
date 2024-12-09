import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { UseGetVenueSignersReturn } from '@/hooks/venue/useGetVenueSigners';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { getItemNumber, useLocalPagination } from '@/hooks/useLocalPagination';

interface SignersTabProps {
  signers: UseGetVenueSignersReturn['data'];
  isLoading: boolean;
  error: UseGetVenueSignersReturn['error'];
}

export function SignersTab({
  signers,
  isLoading,
  error,
}: SignersTabProps): React.ReactElement {
  const { paginatedItems, ...paginationController } = useLocalPagination(
    signers || [],
  );

  if (isLoading) {
    return <GenericTableSkeleton columnCount={2} rowCount={4} />;
  }

  if (error) {
    return (
      <Typography color="error">
        Error gettings signers: {error.message}
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ minHeight: '15rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="10%">#</TableCell>
              <TableCell>Signer Account</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((account, index) => (
                <TableRow key={account.key}>
                  <TableCell>
                    {getItemNumber(
                      paginationController.paginationInfo.currentPage,
                      paginationController.paginationInfo.pageSize,
                      index,
                    )}
                  </TableCell>
                  <TableCell>
                    <AccountOrDidTextField
                      value={account.address}
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
