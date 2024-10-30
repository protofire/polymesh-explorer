'use client';

import { Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSearchPolymeshEntity } from '@/hooks/polymeshEntity/useSearchPolymeshEntity';
import { SearchTextInput } from '../shared/SearchTextInput';
import { CustomBox } from './styled';
import { transformToOption } from '@/domain/trasnformers/toSearchTextInputOption';

export default function AccountExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: results,
    isFetching: isLoading,
    error,
    refetch,
  } = useSearchPolymeshEntity({
    searchTerm,
  });

  const options = useMemo(() => {
    return results.map((result) => transformToOption(result));
  }, [results]);

  return (
    <CustomBox>
      <Typography variant="h4" component="h1" gutterBottom>
        Search on Polymesh Explorer
      </Typography>
      <SearchTextInput
        label="Search by DID / Venue / Asset / Portfolio"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        options={options}
        isLoading={isLoading}
        onRefetch={refetch}
        size="big"
      />
      {error && (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      )}
    </CustomBox>
  );
}
