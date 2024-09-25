'use client';

import {
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  styled,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchPolymeshEntity } from '@/hooks/useSearchPolymeshEntity';
import { JsonViewer } from '../shared/JsonViewer';

const CustomBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem',
  color: '#fff',
});

const SearchField = styled(TextField)({
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

  return (
    <CustomBox>
      <Typography variant="h4" component="h1" gutterBottom>
        Search on Polymesh Explorer
      </Typography>
      <SearchField
        fullWidth
        label="Search by DID / Venue / Asset / Portfolio"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon style={{ color: '#888' }} />
            </InputAdornment>
          ),
        }}
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
