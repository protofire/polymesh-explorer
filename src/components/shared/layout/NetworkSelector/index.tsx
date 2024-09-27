'use client';

import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { NetworkSelect } from './styled';

export function NetworkSelector() {
  const [network, setNetwork] = useState<'Mainnet' | 'Testnet'>('Mainnet');

  const handleNetworkChange = (
    event: SelectChangeEvent<'Mainnet' | 'Testnet'>,
  ) => {
    setNetwork(event.target.value as 'Mainnet' | 'Testnet');
  };

  return (
    <NetworkSelect
      value={network}
      onChange={(event: SelectChangeEvent<unknown>) =>
        handleNetworkChange(event as SelectChangeEvent<'Mainnet' | 'Testnet'>)
      }
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: '#070506',
            color: '#fff',
          },
        },
      }}
    >
      <MenuItem value="Mainnet">Mainnet</MenuItem>
      <MenuItem value="Testnet">Testnet</MenuItem>
    </NetworkSelect>
  );
}
