import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

export interface Asset {
  ticker: string;
  name: string;
  type: string;
  totalSupply: string;
  divisible: boolean;
  owner: {
    did: string;
  };
  documents: {
    totalCount: number;
  };
  assetHolders: {
    totalCount: number;
  };
  createdAt: string;
}

export function useGetAsset(
  ticker: string,
): UseQueryResult<Asset | null, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<Asset | null, Error>(['asset', ticker], async () => {
    if (!assetService) throw new Error('Asset service not initialized');
    return assetService.findByTicker(ticker);
  });
}
