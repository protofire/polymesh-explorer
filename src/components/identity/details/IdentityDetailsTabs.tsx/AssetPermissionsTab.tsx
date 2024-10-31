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
  Collapse,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { AssetPermissions } from '@/domain/entities/AssetPermissions';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';

interface AssetPermissionsTabProps {
  assetPermissions?: AssetPermissions[];
  isLoading: boolean;
}

interface RowProps {
  permission: AssetPermissions;
}

const generatePermissionDetailKey = (assetId: string, detail: string) => {
  return `${assetId}-${detail.replace(/\s+/g, '-').toLowerCase()}`;
};

function Row({ permission }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="none" sx={{ width: 42, pl: 1 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <GenericLink href={`${ROUTES.Asset}/${permission.asset.assetId}`}>
            {permission.asset.ticker ||
              truncateAddress(permission.asset.assetUuid, 4)}
          </GenericLink>
        </TableCell>
        <TableCell>{permission.groupType}</TableCell>
        <TableCell>{permission.permissions.description}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle2" gutterBottom component="div">
                Detailed Permissions
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                {permission.permissions.details.map((detail) => (
                  <li
                    key={generatePermissionDetailKey(
                      permission.asset.assetId as string,
                      detail,
                    )}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {detail}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function AssetPermissionsTab({
  assetPermissions,
  isLoading,
}: AssetPermissionsTabProps): React.ReactElement {
  if (isLoading) {
    return <GenericTableSkeleton columnCount={4} rowCount={5} />;
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
            <TableCell width="50px" /> {/* Column for expand/collapse */}
            <TableCell>Asset</TableCell>
            <TableCell>Group Type</TableCell>
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assetPermissions.map((permission) => (
            <Row key={permission.asset.assetId} permission={permission} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
