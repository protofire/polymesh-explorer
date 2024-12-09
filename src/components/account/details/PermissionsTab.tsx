/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
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
import {
  DefaultPortfolio,
  NumberedPortfolio,
  FungibleAsset,
} from '@polymeshassociation/polymesh-sdk/types';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { AccountDetails } from '@/domain/entities/Account';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

interface PermissionsTabProps {
  accountDetails: AccountDetails | null;
  isLoading: boolean;
  error: Error | null;
}

interface AssetLike {
  id?: string;
  ticker?: string;
}

type PermissionValue =
  | string
  | FungibleAsset
  | DefaultPortfolio
  | NumberedPortfolio
  | AssetLike;

interface SectionPermissions<T = PermissionValue> {
  values: T[];
  type: 'Include' | 'Exclude';
  exceptions?: T[];
}

const isFungibleAsset = (value: PermissionValue): value is FungibleAsset => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'uuid' in value &&
    'id' in value &&
    value.constructor?.name === 'FungibleAsset'
  );
};

const isDefaultPortfolio = (
  value: PermissionValue,
): value is DefaultPortfolio => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'owner' in value &&
    value.constructor?.name === 'DefaultPortfolio'
  );
};

const isNumberedPortfolio = (
  value: PermissionValue,
): value is NumberedPortfolio => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'owner' in value &&
    value.constructor?.name === 'NumberedPortfolio'
  );
};

const hasId = (value: object): value is { id: string } => {
  return 'id' in value;
};

const hasTicker = (value: object): value is { ticker: string } => {
  return 'ticker' in value;
};

const hasNumber = (value: object): value is { number: string | number } => {
  return 'number' in value;
};

const formatPermissionValue = (value: PermissionValue): string => {
  if (typeof value === 'string') {
    return value
      .split('.')
      .map((part) =>
        part
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()),
      )
      .join(' → ');
  }

  if (isFungibleAsset(value)) {
    return `Asset ${value.id}`;
  }

  if (isDefaultPortfolio(value)) {
    return 'Default Portfolio';
  }

  if (isNumberedPortfolio(value) && hasNumber(value)) {
    return `Portfolio ${value.number || ''}`;
  }

  if (typeof value === 'object' && value !== null) {
    if (hasId(value)) return `Asset ${value.id}`;
    if (hasTicker(value)) return `Asset ${value.ticker}`;
  }

  return '';
};

export function PermissionsTab({
  accountDetails,
  isLoading,
  error,
}: PermissionsTabProps) {
  const renderSectionCell = useCallback(
    (icon: React.ReactNode, text: string) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {React.cloneElement(icon as React.ReactElement, { sx: { mr: 1 } })}
        <Typography>{text}</Typography>
      </Box>
    ),
    [],
  );

  const renderSectionPermissions = useCallback(
    <T extends PermissionValue>(permissions: SectionPermissions<T> | null) => {
      if (!permissions) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography>All</Typography>
          </Box>
        );
      }

      const { values, type, exceptions } = permissions;

      const icon =
        type === 'Include' ? (
          <CheckCircle color="success" sx={{ mr: 1 }} />
        ) : (
          <Cancel color="error" sx={{ mr: 1 }} />
        );

      const formattedValues = values
        .map(formatPermissionValue)
        .filter((value): value is string => value !== '');

      if (formattedValues.length === 0) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon}
            <Typography>None</Typography>
          </Box>
        );
      }

      let displayText = `${type} (${formattedValues.join(', ')}`;

      if (exceptions && exceptions.length > 0) {
        const formattedExceptions = exceptions
          .map(formatPermissionValue)
          .filter((value): value is string => value !== '');
        if (formattedExceptions.length > 0) {
          displayText += ` except ${formattedExceptions.join(', ')}`;
        }
      }

      displayText += ')';

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography>{displayText}</Typography>
        </Box>
      );
    },
    [],
  );

  if (isLoading) {
    return <GenericTableSkeleton columnCount={2} rowCount={5} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

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
