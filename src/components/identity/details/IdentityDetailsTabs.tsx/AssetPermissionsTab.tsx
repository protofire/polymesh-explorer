import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import { useGetIdentityAssetPermissions } from '@/hooks/identity/useGetIdentityAssetPermissions';

type AssetPermissions = NonNullable<
  ReturnType<typeof useGetIdentityAssetPermissions>['data']
>[number];

interface AssetPermissionsTabProps {
  assetPermissions?: AssetPermissions[];
  isLoading: boolean;
}

export function AssetPermissionsTab({
  assetPermissions,
  isLoading,
}: AssetPermissionsTabProps): React.ReactElement {
  if (isLoading) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  if (!assetPermissions?.length) {
    return (
      <Box p={2}>
        <Typography>No asset permissions found for this identity</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell>Permission Group</TableCell>
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assetPermissions.map((permission) => (
            <TableRow key={permission.asset.ticker}>
              <TableCell>{permission.asset.ticker}</TableCell>
              <TableCell>{permission.groupType}</TableCell>
              <TableCell>{permission.permissions.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 