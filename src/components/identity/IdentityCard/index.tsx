import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';

interface IdentityCardProps {
  did: string;
  claims: number;
  assets: number;
  venue: number;
  portfolios: number;
  primaryKey: string;
  secondaryKeys: string[];
}

export function IdentityCard({
  did,
  claims,
  assets,
  venue,
  portfolios,
  primaryKey,
  secondaryKeys,
}: IdentityCardProps): React.ReactElement {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Identity</Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" color="textSecondary">
            DID:
          </Typography>
          <Typography variant="body1" ml={1}>
            {did}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} mt={2}>
          <Box width="25%">
            <Typography variant="body2">Claims</Typography>
            <Typography variant="h6">{claims}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Assets</Typography>
            <Typography variant="h6">{assets}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Venue</Typography>
            <Typography variant="h6">{venue}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Portfolios</Typography>
            <Typography variant="h6">{portfolios}</Typography>
          </Box>
        </Stack>
        <Box mt={2}>
          <Typography variant="body2">Primary Key</Typography>
          <Typography variant="body1">{primaryKey}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">Secondary Keys</Typography>
          {secondaryKeys.map((key) => (
            <Typography variant="body1" key={key}>
              {key}
            </Typography>
          ))}
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Custodian
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
