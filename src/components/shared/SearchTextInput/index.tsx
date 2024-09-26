/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { InputAdornment, CircularProgress, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { StyledAutocomplete, StyledTextField } from './styled';
import { SearchTextInputOption } from '@/domain/ui/SearchTextInputOption';
import { RenderOptionItem } from './RenderOption';

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options?: SearchTextInputOption[];
  isLoading?: boolean;
  onRefetch?: () => void;
}

export function SearchTextInput({
  label,
  value,
  onChange,
  options = [],
  isLoading,
  onRefetch,
}: SearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SearchTextInputOption | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setOpen(event.target.value !== '');
  };

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    } else {
      setSelectedOption(null);
    }
  }, [options]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && selectedOption) {
      window.location.href = selectedOption.link;
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
        typeof option === 'string'
          ? option
          : (option as SearchTextInputOption).value
      }
      renderOption={(props, option) => (
        <RenderOptionItem
          props={props}
          option={option as SearchTextInputOption}
        />
      )}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label}
          fullWidth
          margin="normal"
          onKeyDown={handleKeyDown}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <IconButton sx={{ color: '#888' }} onClick={onRefetch}>
                    <SearchIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
      groupBy={(option: unknown) => {
        if (typeof option === 'string') return 'Others';
        return (option as SearchTextInputOption).type.toUpperCase();
      }}
      sx={{ width: '100%' }}
      noOptionsText="No results found"
    />
  );
}
