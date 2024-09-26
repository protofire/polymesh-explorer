'use client';

import { Typography, Box, Button, styled } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSearchPolymeshEntity } from '@/hooks/useSearchPolymeshEntity';
import { JsonViewer } from '../shared/JsonViewer';
import { SearchTextInput } from '../shared/SearchTextInput';

const CustomBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  color: '#fff',
});

export default function AccountExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data,
    isFetching: isLoading,
    error,
    refetch,
  } = useSearchPolymeshEntity({
    searchTerm,
  });

  const options = useMemo(() => {
    if (!data.data) return [];
    return [{ type: data.searchCriteria.type, value: data.data?.key }];
  }, [data]);

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
      />
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#f50057' }}
        onClick={() => refetch()}
      >
        Search
      </Button>
      {isLoading && <Typography>Loading...</Typography>}
      {error && (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      )}
      {data.data && (
        <Box mt={2}>
          <Typography variant="h6">
            {data.searchCriteria.type} Details
          </Typography>
          <JsonViewer data={data.data} />
        </Box>
      )}
    </CustomBox>
  );
}
