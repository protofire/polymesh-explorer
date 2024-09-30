import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { NetworkType, NetworkConfig } from '@/domain/services/NetworkType';
import { LocalStorageNetworkRepository } from '@/services/localstorage/LocalStorageNetworkRepository';
import { NETWORK_MAP } from '@/config/constant';

interface NetworkContextType {
  currentNetwork: NetworkType | undefined;
  currentNetworkConfig: NetworkConfig | undefined;
  setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);
const networkRepository = new LocalStorageNetworkRepository();

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [currentNetwork, setCurrentNetworkState] = useState<NetworkType>();
  const [currentNetworkConfig, setCurrentNetworkConfig] =
    useState<NetworkConfig>();

  const setNetwork = useCallback((newNetwork: NetworkType) => {
    setCurrentNetworkState(newNetwork);
    networkRepository.setNetworkSelected(newNetwork);
  }, []);

  const initCurrentNetworkConfig = useCallback(
    (networkSelected: NetworkType) => {
      if (networkSelected === 'custom') {
        const customChainConfig = networkRepository.getCustomChain();
        setCurrentNetworkConfig(customChainConfig);
      }

      setCurrentNetworkConfig(NETWORK_MAP[networkSelected]);
    },
    [],
  );

  useEffect(() => {
    const networkSelected = networkRepository.getNetworkSelected();

    setCurrentNetworkState(networkSelected);
    initCurrentNetworkConfig(networkSelected);
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

export const useNetworkProvider = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetworkProvider must be used inside NetworkProvider');
  }
  return context;
};
