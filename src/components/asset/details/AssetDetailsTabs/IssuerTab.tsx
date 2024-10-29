import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Asset } from '@/domain/entities/Asset';

interface IssuerTabProps {
  asset: Asset;
}

export function IssuerTab({ asset }: IssuerTabProps) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Issuer Information on {asset.name}
      </Typography>
      <Stack spacing={2}>
        {/* {asset.issuerInfo && (
          <>
            <Box>
              <Typography color="textSecondary" variant="body2">
                Company Name
              </Typography>
              <Typography>{asset.issuerInfo.companyName}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" variant="body2">
                Registration Number
              </Typography>
              <Typography>{asset.issuerInfo.registrationNumber}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" variant="body2">
                Jurisdiction
              </Typography>
              <Typography>{asset.issuerInfo.jurisdiction}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" variant="body2">
                Regulatory Status
              </Typography>
              <Typography>{asset.issuerInfo.regulatoryStatus}</Typography>
            </Box>
          </>
        )} */}
      </Stack>
    </Box>
  );
}
