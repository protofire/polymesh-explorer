import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';

export function useGetAsset(
  ticker: string,
): UseQueryResult<Asset | null, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<Asset | null, Error>({
    queryKey: ['asset', ticker],
    queryFn: async () => {
      if (!assetService) throw new Error('Asset service not initialized');
      const assetNode = await assetService.findByAssetId(ticker);
      if (assetNode === null) return null;

      return assetNode;
    },
  });
}
