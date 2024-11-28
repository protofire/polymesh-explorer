import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  paddingTop?: string;
}

export function SearchTextInput({
  label,
  value,
  onChange,
  options = [],
  isLoading,
  onRefetch,
  size = 'small',
  paddingTop,
}: SearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SearchTextInputOption | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null); // Ref for the input

  const handleSearch = useCallback(() => {
    if (onRefetch) {
      onRefetch();
      setOpen(true);
    }
  }, [onRefetch]);

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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default Enter behavior
        event.stopPropagation(); // Stop event propagation

        if (selectedOption && selectedOption?.type !== 'Unknown') {
          window.location.href = selectedOption.link;
        } else {
          handleSearch();
        }
      }
    },
    [selectedOption, handleSearch],
  );

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
      sx={paddingTop !== undefined ? { pt: paddingTop } : undefined}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={value || ''}
      onInputChange={(event, newValue) => {
        if (event) {
          handleInputChange(event as React.ChangeEvent<HTMLInputElement>);
        }
        setOpen(!!newValue);
      }}
      options={options}
      getOptionLabel={(option: unknown) => {
        if (!option) return '';
        return typeof option === 'string'
          ? option
          : (option as SearchTextInputOption).value || '';
      }}
      value={selectedOption || null}
      onChange={(event, newValue) => {
        if (newValue && typeof newValue === 'object') {
          const inputOptionValue = newValue as SearchTextInputOption;
          setSelectedOption(inputOptionValue);
          if (inputOptionValue.type !== 'Unknown' && inputOptionValue.link) {
            window.location.href = inputOptionValue.link;
          }
        } else {
          setSelectedOption(null);
        }
      }}
      onKeyDown={handleKeyDown}
      renderOption={(props, option, { selected }) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
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
          customBigHeight={size === 'big'}
          slotProps={{
            input: {
              ...params.InputProps,
              onKeyDown: handleKeyDown,
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <IconButton
                      sx={{ color: '#d4d4d4' }}
                      onClick={handleSearch}
                    >
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
