import React from 'react';
import { Box, Typography, Chip, Stack, Tooltip } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import GroupIcon from '@mui/icons-material/Group';
import CodeIcon from '@mui/icons-material/Code';
import { Account } from '@/domain/entities/Account';
import { IdentityCardSkeleton } from '@/components/identity/details/IdentityCard/IdentityCardSkeleton';
import CopyButton from '@/components/shared/common/CopyButton';
import { PolymeshExplorerLink } from '@/components/shared/ExplorerLink/PolymeshExplorerLink';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import { DocumentationIconButton } from '@/components/shared/fieldAttributes/DocumentationIconButton';

interface AccountCardProps {
  account: Account | undefined | null;
  isLoading?: boolean;
}

export function AccountCard({
  account,
  isLoading,
}: AccountCardProps): React.ReactElement {
  if (!account || isLoading) {
    return <IdentityCardSkeleton textField="Account Details" />;
  }
  const {
    key,
    identityDid,
    identityRelationship,
    isMultisig,
    isSmartContract,
  } = account;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">Account Details</Typography>
          <DocumentationIconButton polymeshEntity="account" />
        </Box>
        <Stack direction="row" spacing={1}>
          {isMultisig && (
            <Tooltip title="This is a Multisig account">
              <Chip
                icon={<GroupIcon />}
                label="Multisig"
                color="primary"
                variant="outlined"
              />
            </Tooltip>
          )}
          {isSmartContract && (
            <Tooltip title="This is a Smart Contract account">
              <Chip
                icon={<CodeIcon />}
                label="Smart Contract"
                color="secondary"
                variant="outlined"
              />
            </Tooltip>
          )}
        </Stack>
      </Box>
      <Box display="flex" alignItems="center" mt={2} mb={2}>
        <Identicon
          theme="polkadot"
          value={key}
          size={56}
          style={{ marginRight: '16px' }}
        />
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography variant="body1" color="textSecondary">
            Key:
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{
                mr: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {key}
            </Typography>
            <CopyButton text={key} />
            <PolymeshExplorerLink hash={key} />
          </Box>
        </Box>
      </Box>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Typography variant="body2" mb={1}>
            Associated identity
          </Typography>
          {identityDid ? (
            <AccountOrDidTextField
              value={identityDid}
              showIdenticon
              isIdentity
            />
          ) : (
            <Typography>-</Typography>
          )}
        </Box>
        <Box flex={1}>
          <Typography variant="body2" mb={1}>
            Account Type
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {identityRelationship}
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
