'use client';

import { useState } from 'react';
import {
  AppBar,
  Container,
  styled,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const MainContainer = styled(Container)(() => ({
  minHeight: '100vh',
  background: 'linear-gradient(to right, #0d0d0d, #1a1a1a)',
  color: '#fff',
}));

const CustomAppBar = styled(AppBar)({
  backgroundColor: '#1a1a1a',
  boxShadow: 'none',
  padding: '1rem 0',
  height: '7.5rem',
});

const NetworkSelect = styled(Select)(() => ({
  marginLeft: 'auto',
  color: '#fff',
  backgroundColor: '#2D2D2D',
  borderRadius: '20px',
  minWidth: '120px',
  height: '40px',
  '.MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
  '&.Mui-focused': {
    backgroundColor: '#3D3D3D',
  },
  '.MuiSelect-select': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.MuiSvgIcon-root': {
    color: '#fff',
  },
}));

export function AppLayout({
  children,
  buttonActionComponent,
}: React.PropsWithChildren<{ buttonActionComponent?: React.ReactNode }>) {
  const [network, setNetwork] = useState<'Mainnet' | 'Testnet'>('Mainnet');

  const handleNetworkChange = (
    event: SelectChangeEvent<'Mainnet' | 'Testnet'>,
  ) => {
    setNetwork(event.target.value as 'Mainnet' | 'Testnet');
  };

  return (
    <>
      <CustomAppBar position="static">
        <Toolbar>
          <Typography variant="h6">Polymesh Explorer</Typography>
          {buttonActionComponent || (
            <NetworkSelect
              value={network}
              onChange={(event: SelectChangeEvent<unknown>) =>
                handleNetworkChange(
                  event as SelectChangeEvent<'Mainnet' | 'Testnet'>,
                )
              }
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#2D2D2D',
                    color: '#fff',
                  },
                },
              }}
            >
              <MenuItem value="Mainnet">Mainnet</MenuItem>
              <MenuItem value="Testnet">Testnet</MenuItem>
            </NetworkSelect>
          )}
        </Toolbar>
      </CustomAppBar>
      <MainContainer maxWidth="lg">{children}</MainContainer>
    </>
  );
}
