import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import Link from 'next/link';
import { Identity } from '@/domain/entities/Identity';
import { truncateAddress } from '@/services/polymesh/address';
import { SecondaryKeys } from './SecondaryKeys';

interface IdentityCardProps {
  identityDid: Identity['did'];
  identity: Identity;
  isLoading?: boolean;
}

export function IdentityCard({
  identityDid,
  identity,
}: IdentityCardProps): React.ReactElement {
  const {
    claimsCount,
    assetsCount,
    venuesCount,
    portfoliosCount,
    secondaryAccounts,
    primaryAccount,
  } = identity;

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Identicon
            value={identityDid}
            size={56}
            style={{ marginRight: '16px' }}
          />
          <Typography variant="h4">Identity</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" color="textSecondary">
            DID:
          </Typography>
          <Typography variant="body1" ml={1}>
            {identityDid}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} mt={2}>
          <Box width="25%">
            <Typography variant="body2">Claims</Typography>
            <Typography variant="h6">{claimsCount}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Assets</Typography>
            <Typography variant="h6">{assetsCount}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Venue</Typography>
            <Typography variant="h6">{venuesCount}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Portfolios</Typography>
            <Typography variant="h6">{portfoliosCount}</Typography>
          </Box>
        </Stack>
        <Box mt={2}>
          <Typography variant="body2">Primary Key</Typography>
          <Typography variant="body1">
            <Link href={`/account/${primaryAccount}`}>
              {truncateAddress(primaryAccount)}
            </Link>
          </Typography>
        </Box>
        <SecondaryKeys secondaryAccounts={secondaryAccounts} />
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Custodian
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
