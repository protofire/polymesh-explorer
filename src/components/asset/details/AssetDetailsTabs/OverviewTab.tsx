import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';

interface OverviewTabProps {
  asset: Asset;
}

export function OverviewTab({ asset }: OverviewTabProps) {
  return (
    <Box p={2}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Compliance Rules
          </Typography>
          <Stack spacing={1}>
            <Typography>
              {/* Transfer Status: {asset.transfersAreFrozen ? 'Frozen' : 'Active'} */}
            </Typography>
            <Typography>
              {/* Max Holders: {asset.maxHolderCount || 'Unlimited'} */}
            </Typography>
            {/* {asset.trustedClaimIssuers?.map((issuer) => (
              <AccountOrDidTextField key={issuer} value={issuer} isIdentity />
            ))} */}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Asset Configuration
          </Typography>
          <Stack spacing={1}>
            <Typography>
              Divisible: {asset.isDivisible ? 'Yes' : 'No'}
            </Typography>
            {/* <Typography>Metadata: {asset.metadata || 'Not set'}</Typography> */}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Venues
          </Typography>
          <Stack direction="row" spacing={1}>
            {/* {asset.allowedVenues?.map((venue) => (
              <Chip key={venue} label={venue} />
            ))} */}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Asset Agents
          </Typography>
          <Stack spacing={1}>
            {/* {asset.agents?.map((agent) => (
              <AccountOrDidTextField key={agent} value={agent} isIdentity />
            ))} */}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
