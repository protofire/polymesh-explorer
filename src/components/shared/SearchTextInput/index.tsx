import React, { useState, useEffect, useRef } from 'react';
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
  size?: 'big' | 'small';
}

export function SearchTextInput({
  label,
  value,
  onChange,
  options = [],
  isLoading,
  onRefetch,
  size = 'small',
}: SearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SearchTextInputOption | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null); // Ref for the input

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
    if (
      event.key === 'Enter' &&
      selectedOption &&
      selectedOption?.type !== 'Unknown'
    ) {
      window.location.href = selectedOption.link;
    }
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus(); // Focus the search input on Ctrl + K
      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

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
      value={selectedOption}
      onChange={(event, newValue) => {
        setSelectedOption(newValue as SearchTextInputOption | null);
      }}
      renderOption={(props, option, { selected }) => {
        const _option = option as SearchTextInputOption;

        return (
          <RenderOptionItem
            key={`${_option.type}-${_option.key}`}
            props={props}
            option={option as SearchTextInputOption}
            selected={selected || option === selectedOption}
          />
        );
      }}
      renderInput={(params) => (
        <StyledTextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label={label}
          fullWidth
          inputRef={searchInputRef} // Attach the ref here
          onKeyDown={handleKeyDown}
          customBigHeight={size === 'big'}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <IconButton sx={{ color: '#d4d4d4' }} onClick={onRefetch}>
                      <SearchIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      groupBy={(option: unknown) => {
        if (typeof option === 'string') return 'Others';
        return (option as SearchTextInputOption).type.toUpperCase();
      }}
      noOptionsText="No results found"
    />
  );
}
