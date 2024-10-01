import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';

interface AssetListItem {
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
  createdAt: string; // Añadimos este campo
}

interface AssetListResponse {
  assets: AssetListItem[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string;
}

interface UseListAssetsParams {
  pageSize: number;
  cursor?: string;
}

export function useListAssets({
  pageSize,
  cursor,
}: UseListAssetsParams): UseQueryResult<AssetListResponse, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;

    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<
    AssetListResponse,
    Error,
    AssetListResponse,
    [string, number, string | undefined]
  >({
    queryKey: ['assets', pageSize, cursor],
    queryFn: async () => {
      if (!assetService) throw new Error('Asset service not initialized');

      return assetService.getAssetList(pageSize, cursor);
    },
  });
}