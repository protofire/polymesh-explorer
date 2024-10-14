import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import {
  DEFAULT_PAGE_SIZE,
  usePaginationControllerGraphQl,
} from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseListAssetsReturn = PaginatedData<Asset[]>;

export function useListAssets(
  initialPageSize: number = DEFAULT_PAGE_SIZE,
): UseQueryResult<UseListAssetsReturn> {
  const { graphQlClient, networkConfig } = usePolymeshSdkService();
  const assetService = new AssetGraphRepo(graphQlClient);
  const paginationController = usePaginationControllerGraphQl({
    initialPageSize,
  });

  return useQuery<UseListAssetsReturn, Error>({
    queryKey: [
      'useListAssets',
      networkConfig,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: async () => {
      try {
        const result = await assetService.getAssetList(
          paginationController.paginationInfo.pageSize,
          paginationController.paginationInfo.cursor ?? undefined,
        );

        paginationController.setPageInfo({
          ...result.pageInfo,
          totalCount: result.totalCount,
          pageSize: paginationController.paginationInfo.pageSize,
          currentStartIndex:
            paginationController.paginationInfo.currentStartIndex,
        });

        return {
          data: result.assets,
          paginationController,
        };
      } catch (e) {
        customReportError(e);
        throw e;
      }
    },
    enabled: !!graphQlClient,
  });
}
