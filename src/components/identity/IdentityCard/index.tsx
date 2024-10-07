import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import Link from 'next/link';
import { Identity } from '@/domain/entities/Identity';
import { truncateAddress } from '@/services/polymesh/address';
import { SecondaryKeys } from './SecondaryKeys';
import { AssetTabs } from './AssetTabs';

interface IdentityCardProps {
  identityDid: Identity['did'];
  identity: Identity;
  isLoading?: boolean;
}

export function IdentityCard({
  identityDid,
  identity,
  isLoading,
}: IdentityCardProps): React.ReactElement {
  const {
    claimsCount,
    assetsCount,
    venuesCount,
    portfoliosCount,
    secondaryAccounts,
    primaryAccount,
    ownedAssets,
    heldAssets,
  } = identity;

  const renderValue = (value: string | number | undefined) =>
    value === undefined || isLoading ? <Skeleton /> : value;

  return (
    <Card
      variant="outlined"
      sx={{
        background: '#0a0608d1',
        marginTop: '2rem',
        padding: '1rem',
        borderRadius: '1rem',
        border: '1px solid #240A2E',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Identicon
            value={identityDid}
            size={42}
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
            <Typography variant="h6">{renderValue(claimsCount)}</Typography>
          </Box>
          <Box width="25%">
            <Typography variant="body2">Assets</Typography>
            <Typography variant="h6">{renderValue(assetsCount)}</Typography>
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
        {secondaryAccounts && secondaryAccounts.length > 0 && (
          <SecondaryKeys secondaryAccounts={secondaryAccounts} />
        )}
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Custodian
          </Button>
        </Box>
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Assets
          </Typography>
          <AssetTabs ownedAssets={ownedAssets} heldAssets={heldAssets} />
        </Box>
      </CardContent>
    </Card>
  );
}
