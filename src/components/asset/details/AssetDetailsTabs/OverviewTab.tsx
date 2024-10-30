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
  Chip,
} from '@mui/material';
import { AssetDetails } from '@/domain/entities/Asset';
import { NoDataAvailableTBody } from '@/components/shared/common/NoDataAvailableTBody';
import { GenericTableSkeleton } from '@/components/shared/common/GenericTableSkeleton';
import { useLocalPagination } from '@/hooks/useLocalPagination';
import { PaginationFooter } from '@/components/shared/common/PaginationFooter';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';

interface OverviewTabProps {
  assetDetails: AssetDetails | null;
  isLoading: boolean;
  error: Error | null;
}

export function OverviewTab({
  assetDetails,
  isLoading,
  error,
}: OverviewTabProps): React.ReactElement {
  const requirements = assetDetails?.compliance?.requirements || [];
  const trustedIssuers = assetDetails?.trustedClaimIssuers || [];

  const { paginatedItems: paginatedRequirements, ...requirementsPagination } =
    useLocalPagination(requirements);

  const { paginatedItems: paginatedIssuers, ...issuersPagination } =
    useLocalPagination(trustedIssuers);

  if (isLoading) {
    return <GenericTableSkeleton columnCount={3} rowCount={5} />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Compliance Requirements
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Conditions</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequirements.length > 0 ? (
                paginatedRequirements.map((req, index) => (
                  <TableRow key={index}>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>
                      {req.conditions.map((condition, idx) => (
                        <Box key={idx} mb={1}>
                          <Typography variant="body2">
                            {condition.type}: {condition.value}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.isActive ? 'Active' : 'Inactive'}
                        color={req.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataAvailableTBody
                  colSpan={3}
                  message="No compliance requirements available."
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationFooter paginationController={requirementsPagination} />
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Trusted Claim Issuers
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Identity</TableCell>
                <TableCell>Claim Types</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedIssuers.length > 0 ? (
                paginatedIssuers.map((issuer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <AccountOrDidTextField
                        value={issuer.identity.did}
                        showIdenticon
                        isIdentity
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {issuer.trustedFor === null ? (
                          <Chip label="All Claims" size="small" />
                        ) : (
                          issuer.trustedFor.map((claimType, idx) => (
                            <Chip
                              key={idx}
                              label={claimType}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataAvailableTBody
                  colSpan={2}
                  message="No trusted claim issuers available."
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationFooter paginationController={issuersPagination} />
      </Box>
    </>
  );
}
