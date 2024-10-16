import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import Identicon from '@polkadot/ui-identicon';
import Link from 'next/link';
import { Identity } from '@/domain/entities/Identity';
import { SecondaryKeys } from './SecondaryKeys';
import CopyButton from '@/components/shared/common/CopyButton';
import { IdentityCardSkeleton } from './IdentityCardSkeleton';
import { AccountOrDidTextField } from '@/components/shared/AccountOrDidTextField';

interface IdentityCardProps {
  identityDid: Identity['did'];
  identity?: Identity | null;
  isLoading?: boolean;
}

export function IdentityCard({
  identityDid,
  identity,
  isLoading,
}: IdentityCardProps): React.ReactElement {
  if (isLoading || !identity) {
    return <IdentityCardSkeleton />;
  }

  const {
    claimsCount,
    assetsCount,
    venuesCount,
    portfoliosCount,
    secondaryAccounts,
    primaryAccount,
    isCustodian,
    custodiedPortfoliosCount,
    isChildIdentity,
    parentIdentityDid,
  } = identity;

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
          <AccountOrDidTextField value={primaryAccount} />
        </Box>
        {secondaryAccounts && secondaryAccounts.length > 0 && (
          <SecondaryKeys secondaryAccounts={secondaryAccounts} />
        )}
        <Box mt={2}>
          <Stack direction="row" spacing={1}>
            {isCustodian && (
              <Tooltip
                title={`Custodian of ${custodiedPortfoliosCount} portfolios`}
              >
                <Chip
                  icon={<AccountBalanceWalletIcon />}
                  label={`Custodian (${custodiedPortfoliosCount})`}
                  color="primary"
                  variant="outlined"
                />
              </Tooltip>
            )}
            {isChildIdentity && parentIdentityDid && (
              <Tooltip title="Click to view parent identity">
                <Chip
                  icon={<FamilyRestroomIcon />}
                  label="Child Identity"
                  color="secondary"
                  variant="outlined"
                  component={Link}
                  href={`/identity/${parentIdentityDid}`}
                  clickable
                />
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>
      <Stack direction="row" spacing={2} mt={4} mb={2}>
        <Box width="25%">
          <Typography variant="body2">Claims</Typography>
          <Typography variant="h4">{claimsCount}</Typography>
        </Box>
        <Box width="25%">
          <Typography variant="body2">Assets</Typography>
          <Typography variant="h4">{assetsCount}</Typography>
        </Box>
        <Box width="25%">
          <Typography variant="body2">Venue</Typography>
          <Typography variant="h4">{venuesCount}</Typography>
        </Box>
        <Box width="25%">
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Portfolios</Typography>
            <Tooltip title="Each entity has a Default portfolio" arrow>
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="h4">{portfoliosCount}</Typography>
        </Box>
      </Stack>
    </>
  );
}
