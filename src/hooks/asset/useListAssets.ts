import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';

interface AssetListResponse {
  assets: Asset[];
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
  const { graphQlClient, networkConfig } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;

    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<AssetListResponse, Error, AssetListResponse>({
    queryKey: ['assets', networkConfig, pageSize, cursor],
    queryFn: async () => {
      if (!assetService) throw new Error('Asset service not initialized');

      return assetService.getAssetList(pageSize, cursor);
    },
  });
}
