import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { AssetGraphRepo } from '@/services/repositories/AssetGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import {
  CriteriaController,
  useCriteriaController,
} from '@/hooks/useCriteriaController';
import {
  AssetCriteria,
  AssetCriteriaBuilder,
  AssetFilters,
} from '@/domain/criteria/AssetCriteria';

export interface UseListAssetsReturn extends PaginatedData<Asset[]> {
  criteriaController: CriteriaController<AssetCriteria, AssetFilters>;
}

export function useListAssets(): UseQueryResult<UseListAssetsReturn> {
  const { graphQlClient, polymeshService } = usePolymeshSdkService();
  const assetService = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl();
  const criteriaController = useCriteriaController<AssetCriteria, AssetFilters>(
    new AssetCriteriaBuilder(),
    { assetType: 'All' },
    paginationController,
  );

  const fetchAssets = useCallback(async () => {
    if (!assetService) {
      throw new Error('AssetService is not initialized');
    }

    try {
      const criteria = criteriaController.buildCriteria();

      const result = await assetService.getAssetList(criteria);

      paginationController.setPageInfo({
        hasNextPage: result.pageInfo.hasNextPage,
        hasPreviousPage: result.pageInfo.hasPreviousPage,
        startCursor: result.pageInfo.startCursor,
        endCursor: result.pageInfo.endCursor,
        totalCount: result.totalCount,
      });

      return result.assets;
    } catch (e) {
      customReportError(e);
      throw e;
    }
  }, [assetService, criteriaController, paginationController]);

  return useQuery<Asset[], Error, UseListAssetsReturn>({
    queryKey: [
      'useListAssets',
      graphQlClient,
      criteriaController.criteria.assetType,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchAssets,
    select: useCallback(
      (data: Asset[]) => ({
        data,
        paginationController,
        criteriaController,
      }),
      [paginationController, criteriaController],
    ),
    enabled: !!graphQlClient && !!assetService && !!polymeshService,
  });
}
