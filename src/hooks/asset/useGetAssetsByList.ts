import {
  useQuery,
  UseQueryResult,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';

const USE_GET_ASSETS_BY_ID = 'useGetAssetsDetails';

function filterCachedAssetIds(
  queryClient: QueryClient,
  assetIds: string[],
): string[] {
  return assetIds.filter((assetId) => {
    const cachedData = queryClient.getQueryData<Record<string, Asset>>([
      USE_GET_ASSETS_BY_ID,
      [assetId],
    ]);
    return !cachedData;
  });
}

export function useGetAssetsByList(
  assetIds: string[],
): UseQueryResult<Record<string, Asset>, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const queryClient = useQueryClient();

  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const filteredAssetIds = useMemo(
    () => filterCachedAssetIds(queryClient, assetIds),
    [queryClient, assetIds],
  );

  return useQuery<Record<string, Asset>, Error>({
    queryKey: [USE_GET_ASSETS_BY_ID, assetService, filteredAssetIds],
    queryFn: async () => {
      if (!assetService) {
        throw new Error('Asset service not initialized');
      }

      try {
        const assetsDetails =
          await assetService.getAssetsListIds(filteredAssetIds);
        return assetsDetails;
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!assetService && filteredAssetIds.length > 0,
  });
}
