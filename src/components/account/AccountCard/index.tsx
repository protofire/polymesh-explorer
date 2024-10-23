import React from 'react';
import { Box, Typography, Stack, Skeleton } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import GroupKeyIcon from '@mui/icons-material/Diversity3';
import { Account } from '@/domain/entities/Account';
import { IdentityCardSkeleton } from '@/components/identity/details/IdentityCard/IdentityCardSkeleton';
import CopyButton from '@/components/shared/common/CopyButton';
import { AccountOrDidTextField } from '@/components/shared/AccountOrDidTextField';

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

  const renderBooleanValue = (value: boolean | undefined): React.ReactNode => {
    if (value === undefined || isLoading) return <Skeleton width={100} />;
    return (
      <Typography variant="h6" color={value ? 'success.main' : 'error.main'}>
        {value ? 'Yes' : 'No'}
      </Typography>
    );
  };

  return (
    <>
      <Typography variant="h4">Account Details</Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <Identicon value={key} size={56} style={{ marginRight: '16px' }} />
        <Box display="flex" flexDirection="column">
          <Typography variant="body1" color="textSecondary">
            Key:
          </Typography>
          <Box display="flex" gap={1}>
            <Typography variant="body1">{key}</Typography>
            <CopyButton text={identityDid || ''} />
          </Box>
        </Box>
      </Box>
      <Stack direction="row" spacing={2} mt={2}>
        <Box width="33%">
          <Typography variant="body2">Account Type</Typography>
          <Typography variant="h6">{identityRelationship}</Typography>
        </Box>
        <Box width="33%">
          <Typography variant="body2">Multisig</Typography>
          <Box display="flex" alignItems="center">
            <GroupKeyIcon sx={{ marginRight: 1 }} />
            {renderBooleanValue(isMultisig)}
          </Box>
        </Box>
        <Box width="33%">
          <Typography variant="body2">Smart Contract</Typography>
          <Box display="flex" alignItems="center">
            <IntegrationInstructionsIcon sx={{ marginRight: 1 }} />
            {renderBooleanValue(isSmartContract)}
          </Box>
        </Box>
      </Stack>
      <Box
        mt={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box mt={2} mb={2}>
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
            '-'
          )}
        </Box>
      </Box>
    </>
  );
}
