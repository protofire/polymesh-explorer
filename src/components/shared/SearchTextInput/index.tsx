/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  InputAdornment,
  TextField,
  styled,
  Autocomplete,
  Box,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Option {
  value: string;
  type: string;
}

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: Option[];
}

const StyledTextField = styled(TextField)({
  backgroundColor: '#2a2a2a',
  borderRadius: '4px',
  input: {
    color: '#fff',
  },
  '& label': {
    color: '#ccc',
  },
  '& label.Mui-focused': {
    color: '#fff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: '#888',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
  },
});

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-paper': {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: '#3a3a3a',
    },
  },
});

export function SearchTextInput({
  label,
  value,
  onChange,
  options = [],
}: SearchFieldProps) {
  const [open, setOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setOpen(event.target.value !== '');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };
  return (
    <StyledAutocomplete
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={value}
      onInputChange={(event, newValue) => {
        if (event) {
          handleInputChange(event as React.ChangeEvent<HTMLInputElement>);
        }
        setOpen(newValue !== '');
      }}
      options={options}
      getOptionLabel={(option: unknown) =>
        typeof option === 'string' ? option : (option as Option).value
      }
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <AccountBalanceWalletIcon sx={{ color: '#ff5f5f', mr: 2 }} />
          <Typography variant="body2">{(option as Option).value}</Typography>
        </Box>
      )}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          fullWidth
          margin="normal"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
          onKeyDown={handleKeyDown}
        />
      )}
      groupBy={(option: unknown) => {
        if (typeof option === 'string') return 'Others';
        return (option as Option).type.toUpperCase();
      }}
      sx={{ width: '100%' }}
      noOptionsText="No results found"
    />
  );
}
