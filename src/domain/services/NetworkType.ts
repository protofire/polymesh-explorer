export const NETWORK_TYPES = ['mainnet', 'testnet', 'custom'] as const;
export type NetworkType = (typeof NETWORK_TYPES)[number];

export interface NetworkConfig {
  rpc: string;
  graphQlNode: string | undefined;
  subscanUrl: string;
}
