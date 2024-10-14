import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseListAssetsReturn = PaginatedData<Asset[]>;

export function useListAssets(): UseQueryResult<UseListAssetsReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl();

  const fetchAssets = useCallback(async () => {
    if (!assetService) {
      throw new Error('AssetService is not initialized');
    }

    const result = await assetService.getAssetList(
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor ?? undefined,
    );

    paginationController.setPageInfo({
      hasNextPage: result.pageInfo.hasNextPage,
      hasPreviousPage: result.pageInfo.hasPreviousPage,
      startCursor: result.pageInfo.startCursor,
      endCursor: result.pageInfo.endCursor,
      totalCount: result.totalCount,
    });

    return result.assets;
  }, [assetService, paginationController]);

  return useQuery<Asset[], Error, UseListAssetsReturn>({
    queryKey: [
      'useListAssets',
      graphQlClient,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchAssets,
    select: useCallback(
      (data: Asset[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!assetService,
  });
}
