'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAccount } from '@/hooks/useAccount';

export default function AccountExplorer() {
  const [publicKey, setPublicKey] = useState('');
  const { data: account, isLoading, error } = useAccount(publicKey);
  const theme = useTheme();

  // Note: In a real application, you'd lift this state up or use a state management solution
  const toggleTheme = () => {
    // This is a placeholder. In a real app, you'd update the theme state in the Providers component
    console.log('Toggle themee');
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Polymesh Account Explorer
      </Typography>
      <IconButton onClick={toggleTheme} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <TextField
        fullWidth
        label="Public Key"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={() => setPublicKey(publicKey)}>
        Get Account
      </Button>
      {isLoading && <Typography>Loading...</Typography>}
      {error && (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      )}
      {account && (
        <Box mt={2}>
          <Typography variant="h6">Account Details</Typography>
          <Typography>Address: {account.address}</Typography>
          <Typography>Balance: {account.balance.toString()}</Typography>
        </Box>
      )}
    </Box>
  );
}
