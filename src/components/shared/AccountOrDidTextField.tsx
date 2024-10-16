import React from 'react';
import { Box, Typography } from '@mui/material';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from './common/GenericLink';
import CopyButton from './common/CopyButton';

interface AccountOrDidTextFieldProps {
  value: string;
}

export function AccountOrDidTextField({
  value,
}: AccountOrDidTextFieldProps): React.ReactElement {
  return (
    <Box
      display="flex"
      gap={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="body1">
        <GenericLink href={`/account/${value}`}>
          {truncateAddress(value)}
        </GenericLink>
      </Typography>
      <CopyButton text={value} />
    </Box>
  );
}
