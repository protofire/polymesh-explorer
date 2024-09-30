'use client';

import { MenuItem, SelectChangeEvent } from '@mui/material';
import { NetworkSelect, NetworkSelectLoading } from './styled';
import { useNetworkProvider } from '@/context/NetworkProvider';
import { NETWORK_TYPES, NetworkType } from '@/domain/services/NetworkType';
import { capitalizeFirstLetter } from '@/utils/formatString';
import { SpinnerLoading } from '../../common/SpinnerLoading';

export function NetworkSelector() {
  const { currentNetwork, setNetwork: setContextNetwork } =
    useNetworkProvider();

  const handleNetworkChange = (event: SelectChangeEvent<NetworkType>) => {
    const newNetwork = event.target.value as NetworkType;
    setContextNetwork(newNetwork);
  };

  if (!currentNetwork) {
    return <NetworkSelectLoading disabled startIcon={<SpinnerLoading />} />;
  }

  return (
    <NetworkSelect
      value={currentNetwork}
      onChange={(event: SelectChangeEvent<unknown>) =>
        handleNetworkChange(event as SelectChangeEvent<NetworkType>)
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
      {NETWORK_TYPES.map((type) => {
        if (type === 'custom') return null;

        return (
          <MenuItem key={type} value={type}>
            {capitalizeFirstLetter(type)}
          </MenuItem>
        );
      })}
      {/* <MenuItem value="testnet">Testnet</MenuItem> */}
    </NetworkSelect>
  );
}
