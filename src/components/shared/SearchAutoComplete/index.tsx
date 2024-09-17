import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { useDebounce } from '@/hooks/common/useDebounce';
import { PolymeshEntityType } from '@/domain/entities/PolymeshEntity';
import { useSearchPolymeshEntity } from '@/hooks/useSearchPolymeshEntity';

interface SearchAutocompleteProps {
  onSelect: (entity: PolymeshEntityType) => void;
}

export function SearchAutocomplete({ onSelect }: SearchAutocompleteProps) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const { data, isLoading } = useSearchPolymeshEntity({
    searchTerm: debouncedInput,
  });

  return (
    <Autocomplete
      freeSolo
      options={[data.searchCriteria.type || '']}
      loading={isLoading}
      getOptionLabel={(option: string) => `${option}: ${option}`}
      renderInput={(params) => (
        <TextField
          label="Search Account, Identity, or Asset"
          variant="outlined"
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li key={option}>{`${option}: ${option}`}</li>
      )}
      onChange={(event, value) => {
        if (value && typeof value !== 'string') {
          onSelect(value);
        }
      }}
    />
  );
}
