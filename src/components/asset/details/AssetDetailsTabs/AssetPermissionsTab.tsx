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
import { AssetIdentityPermissions } from '@/domain/entities/AssetPermissions';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from '@/components/shared/common/GenericLink';
import { ROUTES } from '@/config/routes';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';

interface AssetPermissionsTabProps {
  assetPermissions?: AssetIdentityPermissions[];
  isLoading: boolean;
}

interface RowProps {
  permission: AssetIdentityPermissions;
}

const generatePermissionDetailKey = (identityDid: string, detail: string) => {
  return `${identityDid}-${detail.replace(/\s+/g, '-').toLowerCase()}`;
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
          <GenericLink href={`${ROUTES.Identity}/${permission.agent.did}`}>
            {truncateAddress(permission.agent.did, 4)}
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
                      permission.agent.did || '',
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
  const { paginatedItems, ...paginationController } = useLocalPagination(
    assetPermissions || [],
  );

  if (isLoading || assetPermissions === undefined) {
    return <GenericTableSkeleton columnCount={4} rowCount={5} />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none" sx={{ width: '50px' }} />
              <TableCell>Identity</TableCell>
              <TableCell>Group Type</TableCell>
              <TableCell>Permissions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetPermissions.length > 0 ? (
              assetPermissions.map((permission) => (
                <Row key={permission.agent.did} permission={permission} />
              ))
            ) : (
              <NoDataAvailableTBody
                colSpan={4}
                message="No permissions found."
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationFooter paginationController={paginationController} />
    </>
  );
}
