import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import Link from 'next/link';
import { Account } from '@/domain/entities/Account';
import { truncateAddress } from '@/services/polymesh/address';

interface AccountCardProps {
  account: Account;
  isLoading?: boolean;
}

function getKeyType(account: Account): string {
  if (account.isPrimaryKey) return 'Primary';
  if (account.isSecondaryKey) return 'Secondary';
  if (account.isMultisig) return 'Multisig';

  return 'Smart Contract';
}

export function AccountCard({
  account,
  isLoading,
}: AccountCardProps): React.ReactElement {
  const { key, identityDid } = account;

  const renderValue = (value: string | number | undefined) =>
    value === undefined || isLoading ? <Skeleton /> : value;

  const keyType = getKeyType(account);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Identicon
            theme="polkadot"
            value={key}
            size={56}
            style={{ marginRight: '16px' }}
          />
          <Typography variant="h4">Account</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="body1" color="textSecondary">
            Key:
          </Typography>
          <Typography variant="body1" ml={1}>
            {truncateAddress(key)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} mt={2}>
          <Box width="33%">
            <Typography variant="body2">Key Type</Typography>
            <Typography variant="h6">{renderValue(keyType)}</Typography>
          </Box>
          {identityDid && (
            <Box mt={2}>
              <Typography variant="body2">Associated Identity</Typography>
              <Typography variant="body2">
                <Link href={`/identity/${identityDid}`}>
                  {truncateAddress(identityDid)}
                </Link>
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
