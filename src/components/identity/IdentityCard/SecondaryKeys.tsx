/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  styled,
  IconButton,
} from '@mui/material';
import Link from 'next/link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import { truncateAddress } from '@/services/polymesh/address';

interface SecondaryKeysProps {
  secondaryAccounts: string[];
}

const StyledAutocomplete = styled(Autocomplete)({
  width: '300px',
});

const OptionWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export function SecondaryKeys({
  secondaryAccounts,
}: SecondaryKeysProps): React.ReactElement {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (secondaryAccounts.length > 0) {
      setSelectedAccount(secondaryAccounts[0]);
    }
  }, [secondaryAccounts]);

  const handleBlur = () => {
    if (!selectedAccount && secondaryAccounts.length > 0) {
      setSelectedAccount(secondaryAccounts[0]);
    }
  };

  const handleCopy = (account: string) => {
    navigator.clipboard.writeText(account);
  };

  return (
    <Box mt={2}>
      <Typography variant="body2" gutterBottom>
        Secondary Keys
      </Typography>
      <StyledAutocomplete
        id="secondary-accounts-selector"
        options={secondaryAccounts}
        value={selectedAccount}
        onChange={(event, value) => {
          if (typeof value === 'string' || value === null) {
            setSelectedAccount(value);
          }
        }}
        onBlur={handleBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search secondary keys account"
            size="small"
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <OptionWrapper>
              <Link href={`/account/${option as string}`}>
                <Typography variant="body2">
                  {truncateAddress(option as string)}
                </Typography>
              </Link>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(option as string)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  component={Link}
                  href={`/account/${option}`}
                >
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Box>
            </OptionWrapper>
          </li>
        )}
        getOptionLabel={(option) => truncateAddress(option as string)}
      />
    </Box>
  );
}
