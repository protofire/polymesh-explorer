import { useContext } from 'react';
import { NetworkContext } from '.';

export const useNetworkProvider = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetworkProvider must be used inside NetworkProvider');
  }
  return context;
};
