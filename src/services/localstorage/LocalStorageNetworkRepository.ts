import { NetworkConfig, NetworkType } from '@/domain/services/NetworkType';
import {
  getLocalStorageState,
  setLocalStorageState,
} from './helperLocalstorage';
import { DEFAULT_NETWORK, NETWORK_MAP } from '@/config/constant';

export interface INetworkRepository {
  getNetworkSelected(): NetworkType;
  getCustomChain(): NetworkConfig | null;
  setCustomChain(networkConfig: NetworkConfig): void;
  setNetworkSelected(networkType: NetworkType): void;
}

export class LocalStorageNetworkRepository implements INetworkRepository {
  private readonly storageKey = 'networkSelected';

  private readonly customChainKey = 'customChain';

  getNetworkSelected(): NetworkType {
    const result = getLocalStorageState<NetworkType>(
      this.storageKey,
      DEFAULT_NETWORK,
    ) as NetworkType;

    return result;
  }

  getCustomChain(): NetworkConfig {
    const result = getLocalStorageState(
      this.customChainKey,
      NETWORK_MAP[DEFAULT_NETWORK],
    ) as NetworkConfig;

    return result;
  }

  setCustomChain(chain: NetworkConfig): void {
    setLocalStorageState(this.customChainKey, JSON.stringify(chain));
  }

  setNetworkSelected(networkType: NetworkType): void {
    setLocalStorageState(this.storageKey, networkType);
  }
}
