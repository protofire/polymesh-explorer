import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/common/useDebounce';
import { PolymeshEntityType } from '@/domain/entities/PolymeshEntity';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

interface SearchAutocompleteProps {
  //   searchRepository: ISearchRepository;
  onSelect: (entity: PolymeshEntityType) => void;
}

export const usePolymeshSearch = () => {
  const [options, setOptions] = useState<PolymeshEntityType[]>([]);
  const [loading, setLoading] = useState(false);
  const { polymeshSdk } = usePolymeshSdkService();

  const searchEntities = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // const results = await searchRepository.searchEntities(searchTerm);
      setOptions([{ type: 'Account' }]);
    } catch (error) {
      console.error('Error searching entities:', error);
      setOptions([]);
    }
    setLoading(false);
  }, []);

  return { options, loading, searchEntities };
};

export function SearchAutocomplete({
  //   searchRepository,
  onSelect,
}: SearchAutocompleteProps) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const { options, loading, searchEntities } = usePolymeshSearch();

  useEffect(() => {
    searchEntities(debouncedInput);
  }, [debouncedInput, searchEntities]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      getOptionLabel={(option: PolymeshEntityType) =>
        `${option.type}: ${option.type}`
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Account, Identity, or Asset"
          variant="outlined"
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.type}>
          {`${option.type}: ${option.type}`}
        </li>
      )}
      onChange={(event, value) => {
        if (value && typeof value !== 'string') {
          onSelect(value);
        }
      }}
    />
  );
}
