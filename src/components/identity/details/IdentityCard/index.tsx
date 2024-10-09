import React from 'react';
import { Box, Typography, Button, Stack, Skeleton } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import Link from 'next/link';
import { Identity } from '@/domain/entities/Identity';
import { truncateAddress } from '@/services/polymesh/address';
import { SecondaryKeys } from './SecondaryKeys';
import CopyButton from '@/components/shared/CopyButton';

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
  } = identity;

  const renderValue = (value: string | number | undefined) =>
    value === undefined || isLoading ? <Skeleton /> : value;

  return (
    <>
      <Typography variant="h4">Identity</Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <Identicon
          value={identityDid}
          size={42}
          style={{ marginRight: '16px' }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="body1" color="textSecondary">
            DID:
          </Typography>
          <Box display="flex" gap={1}>
            <Typography variant="body1">{identityDid}</Typography>
            <CopyButton text={identityDid || ''} />
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
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
      </Box>
      <Stack direction="row" spacing={2} mt={4} mb={2}>
        <Box width="25%">
          <Typography variant="body2">Claims</Typography>
          <Typography variant="h4">{renderValue(claimsCount)}</Typography>
        </Box>
        <Box width="25%">
          <Typography variant="body2">Assets</Typography>
          <Typography variant="h4">{renderValue(assetsCount)}</Typography>
        </Box>
        <Box width="25%">
          <Typography variant="body2">Venue</Typography>
          <Typography variant="h4">{venuesCount}</Typography>
        </Box>
        <Box width="25%">
          <Typography variant="body2">Portfolios</Typography>
          <Typography variant="h4">{portfoliosCount}</Typography>
        </Box>
      </Stack>
    </>
  );
}
