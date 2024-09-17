'use client';

import { Typography, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useSearchPolymeshEntity } from '@/hooks/useSearchPolymeshEntity';
import { JsonViewer } from '../shared/JsonViewer';

export default function AccountExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error, refetch } = useSearchPolymeshEntity({
    searchTerm,
  });

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Polymesh Account Explorer
      </Typography>
      <TextField
        fullWidth
        label="Public Key"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={() => refetch()}>
        Get Account
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
    </Box>
  );
}
