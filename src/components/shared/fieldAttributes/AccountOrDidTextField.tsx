import React from 'react';
import { Box, Typography } from '@mui/material';
import Identicon from '@polkadot/ui-identicon';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from '../common/GenericLink';
import CopyButton from '../common/CopyButton';
import { ROUTES } from '@/config/routes';

interface AccountOrDidTextFieldProps {
  value: string;
  showIdenticon?: boolean;
  isIdentity?: boolean;
  sideLength?: number;
  variant?: 'body1' | 'body2';
}

export function AccountOrDidTextField({
  value,
  showIdenticon = false,
  isIdentity = false,
  sideLength = 5,
  variant = 'body1',
}: AccountOrDidTextFieldProps): React.ReactElement {
  const identiconTheme = isIdentity ? 'jdenticon' : 'polkadot';
  const pathUrl = isIdentity ? ROUTES.Identity : ROUTES.Account;

  return (
    <Box display="flex" gap={1} alignItems="center">
      {showIdenticon && (
        <Identicon
          value={value}
          size={24}
          theme={identiconTheme}
          style={{ marginRight: '5px' }}
        />
      )}
      <Typography variant={variant}>
        <GenericLink href={`${pathUrl}/${value}`}>
          {truncateAddress(value, sideLength)}
        </GenericLink>
      </Typography>
      <CopyButton text={value} />
    </Box>
  );
}
