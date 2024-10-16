import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { truncateAddress } from '@/services/polymesh/address';
import { GenericLink } from './common/GenericLink';

interface AccountOrDidTextFieldProps {
  value: string;
}

export function AccountOrDidTextField({
  value,
}: AccountOrDidTextFieldProps): React.ReactElement {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="body1">
        <GenericLink href={`/account/${value}`}>
          {truncateAddress(value)}
        </GenericLink>
      </Typography>
      <Box>
        <IconButton size="small" onClick={handleCopy}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
