import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
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

const IdentityCard: React.FC<IdentityCardProps> = ({
  did,
  claims,
  assets,
  venue,
  portfolios,
  primaryKey,
  secondaryKeys,
}) => {
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
        <Grid container spacing={2} mt={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Claims</Typography>
            <Typography variant="h6">{claims}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Assets</Typography>
            <Typography variant="h6">{assets}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Venue</Typography>
            <Typography variant="h6">{venue}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2">Portfolios</Typography>
            <Typography variant="h6">{portfolios}</Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body2">Primary Key</Typography>
          <Typography variant="body1">{primaryKey}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">Secondary Keys</Typography>
          {secondaryKeys.map((key, index) => (
            <Typography variant="body1" key={index}>
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
};

export default IdentityCard;
