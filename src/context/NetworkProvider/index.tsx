import React, { createContext, useState, useEffect, useCallback } from 'react';
import { NetworkType, NetworkConfig } from '@/domain/services/NetworkType';
import { LocalStorageNetworkRepository } from '@/services/localstorage/LocalStorageNetworkRepository';
import { NETWORK_MAP } from '@/config/constant';
import { NetworkProviderEvents } from '@/domain/events/NetworkProviderEvents';

interface NetworkContextType {
  currentNetwork: NetworkType | undefined;
  currentNetworkConfig: NetworkConfig | undefined;
  setNetwork: (network: NetworkType) => void;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(
  undefined,
);
const networkRepository = new LocalStorageNetworkRepository();

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [currentNetwork, setCurrentNetworkState] = useState<NetworkType>();
  const [currentNetworkConfig, setCurrentNetworkConfig] =
    useState<NetworkConfig>();

  const setNetwork = useCallback((newNetwork: NetworkType) => {
    networkRepository.setNetworkSelected(newNetwork);
    document.dispatchEvent(new Event(NetworkProviderEvents.networkChanged));
  }, []);

  const initCurrentNetworkConfig = useCallback(
    (networkSelected: NetworkType) => {
      if (networkSelected === 'custom') {
        const customChainConfig = networkRepository.getCustomChain();
        setCurrentNetworkConfig(customChainConfig);
      } else {
        setCurrentNetworkConfig(NETWORK_MAP[networkSelected]);
      }
      setCurrentNetworkState(networkSelected);
    },
    [],
  );

  useEffect(() => {
    const handleNetworkChange = () => {
      const networkSelected = networkRepository.getNetworkSelected();
      initCurrentNetworkConfig(networkSelected);
    };

    handleNetworkChange();

    document.addEventListener(
      NetworkProviderEvents.networkChanged,
      handleNetworkChange,
    );

    return () => {
      document.removeEventListener(
        NetworkProviderEvents.networkChanged,
        handleNetworkChange,
      );
    };
  }, [initCurrentNetworkConfig]);

  const memoizedValue = React.useMemo(
    () => ({
      currentNetwork,
      setNetwork,
      currentNetworkConfig,
      setCurrentNetworkConfig,
    }),
    [currentNetwork, currentNetworkConfig, setNetwork],
  );

  return (
    <NetworkContext.Provider value={memoizedValue}>
      {children}
    </NetworkContext.Provider>
  );
}
