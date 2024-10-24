import React from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccountBalance,
  SwapHoriz,
  Group,
  Folder,
} from '@mui/icons-material';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { AccountDetails } from '@/domain/entities/Account';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

interface PermissionsTabProps {
  accountDetails: AccountDetails | null;
  isLoading: boolean;
  error: Error | null;
}

export function PermissionsTab({
  accountDetails,
  isLoading,
  error,
}: PermissionsTabProps) {
  if (isLoading) {
    return <GenericTableSkeleton columnCount={2} rowCount={5} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSectionPermissions = (permissions: any) => {
    if (!permissions) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle color="success" sx={{ mr: 1 }} />
          <Typography>All</Typography>
        </Box>
      );
    }

    const { values, type } = permissions;
    const icon =
      type === 'Include' ? (
        <CheckCircle color="success" sx={{ mr: 1 }} />
      ) : (
        <Cancel color="error" sx={{ mr: 1 }} />
      );
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography>
          {type} ({values.length > 0 ? values.join(', ') : 'None'})
        </Typography>
      </Box>
    );
  };

  const renderSectionCell = (icon: React.ReactNode, text: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {React.cloneElement(icon as React.ReactElement, { sx: { mr: 1 } })}
      <Typography>{text}</Typography>
    </Box>
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Section</TableCell>
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accountDetails?.permissions ? (
            <>
              <TableRow>
                <TableCell>
                  {renderSectionCell(<AccountBalance />, 'Assets')}
                </TableCell>
                <TableCell>
                  {renderSectionPermissions(accountDetails.permissions.assets)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {renderSectionCell(<SwapHoriz />, 'Transactions')}
                </TableCell>
                <TableCell>
                  {renderSectionPermissions(
                    accountDetails.permissions.transactions,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {renderSectionCell(<Group />, 'Transaction Groups')}
                </TableCell>
                <TableCell>
                  {accountDetails.permissions.transactionGroups.length > 0 ? (
                    <Typography>
                      {accountDetails.permissions.transactionGroups.join(', ')}
                    </Typography>
                  ) : (
                    <Typography>None</Typography>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {renderSectionCell(<Folder />, 'Portfolios')}
                </TableCell>
                <TableCell>
                  {renderSectionPermissions(
                    accountDetails.permissions.portfolios,
                  )}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <NoDataAvailableTBody colSpan={2} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
