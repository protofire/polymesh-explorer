import { NetworkConfig, NetworkType } from '@/domain/services/NetworkType';
import { IS_DEVELOPMENT } from './environment';

// network config nodes
export const POLYMESH_RPC_URL = 'wss://mainnet-rpc.polymesh.network';
export const GRAPHQL_ENDPOINT = 'https://mainnet-graphql.polymesh.network';

export const POLYMESH_RPC_URL_TESTNET = 'wss://testnet-rpc.polymesh.live';
export const GRAPHQL_ENDPOINT_TESTNET = 'https://testnet-graphql.polymesh.live';

export const DEFAULT_NETWORK = IS_DEVELOPMENT ? 'testnet' : 'mainnet';

type NetworkTypeWithoutCustom = Omit<NetworkType, 'custom'> & string;
export const NETWORK_MAP: Record<NetworkTypeWithoutCustom, NetworkConfig> = {
  mainnet: {
    rpc: POLYMESH_RPC_URL,
    graphQlNode: GRAPHQL_ENDPOINT,
  },
  testnet: {
    rpc: POLYMESH_RPC_URL_TESTNET,
    graphQlNode: GRAPHQL_ENDPOINT_TESTNET,
  },
};
