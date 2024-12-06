/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  styled,
  TextField,
} from '@mui/material';
import { CounterBadge } from '@/components/shared/common/CounterBadge';
import { truncateAddress } from '@/services/polymesh/address';
import { AccountOrDidTextField } from '@/components/shared/fieldAttributes/AccountOrDidTextField';
import CopyButton from '@/components/shared/common/CopyButton';

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

  return (
    <Box mt={2}>
      <Typography variant="body2" gutterBottom>
        {secondaryAccounts.length > 1 ? (
          <CounterBadge count={secondaryAccounts.length}>
            Secondary Keys
          </CounterBadge>
        ) : (
          'Secondary Keys'
        )}
      </Typography>
      {secondaryAccounts.length === 1 ? (
        <AccountOrDidTextField value={secondaryAccounts[0]} />
      ) : (
        <StyledAutocomplete
          id="secondary-accounts-selector"
          options={secondaryAccounts}
          value={selectedAccount}
          onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search secondary keys account"
              size="small"
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                <OptionWrapper>
                  <AccountOrDidTextField
                    value={option as string}
                    tooltipPlacement="right"
                    hideCopyButton
                  />
                  <Box>
                    <CopyButton text={option as string} />
                  </Box>
                </OptionWrapper>
              </li>
            );
          }}
          getOptionLabel={(option) => truncateAddress(option as string)}
        />
      )}
    </Box>
  );
}
