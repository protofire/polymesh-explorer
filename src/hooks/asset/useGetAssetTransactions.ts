import {
  Asset as AssetSdk,
  VenueFilteringDetails,
} from '@polymeshassociation/polymesh-sdk/types';
import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Asset } from '@/domain/entities/Asset';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { PaginationController } from '@/domain/ui/PaginationInfo';
import { AssetTransactionGraphRepo } from '@/services/repositories/AssetTransactionGraphRepo';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '../usePaginationControllerGraphQl';

interface Props {
  asset: Asset;
  assetSdk: AssetSdk | undefined;
}

export interface UseGetAssetTransactionsReturn {
  transactions: {
    data: AssetTransaction[] | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  venueFiltering: {
    data: VenueFilteringDetails | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  isLoading: boolean;
  error: Error | null;
  paginationController: PaginationController;
}

export const useGetAssetTransactions = ({
  asset,
  assetSdk,
}: Props): UseGetAssetTransactionsReturn => {
  const { graphQlClient } = usePolymeshSdkService();
  const assetTransactionsRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetTransactionGraphRepo(graphQlClient);
  }, [graphQlClient]);
  const paginationController = usePaginationControllerGraphQl();
  const { pageSize, cursor } = paginationController.paginationInfo;

  const results = useQueries({
    queries: [
      {
        queryKey: ['venueFiltering', asset.assetId],
        queryFn: async () => {
          if (!assetSdk) {
            throw new Error('Asset SDK not initialized');
          }
          return assetSdk.getVenueFilteringDetails();
        },
        enabled: !!asset.assetId && !!assetSdk,
      },
      {
        queryKey: ['assetTransactions', asset.assetId, pageSize, cursor],
        queryFn: async () => {
          if (!assetTransactionsRepo) {
            throw new Error('AssetTransactionGraphRepo not initialized');
          }

          try {
            const result = await assetTransactionsRepo.getAssetTransactions(
              { assetId: asset.assetId },
              pageSize,
              cursor || undefined,
              asset.isNftCollection,
            );

            paginationController.setPageInfo({
              totalCount: result.totalCount,
              hasNextPage: result.pageInfo.hasNextPage,
              hasPreviousPage: result.pageInfo.hasPreviousPage,
              startCursor: result.pageInfo.startCursor,
              endCursor: result.pageInfo.endCursor,
            });

            return result.transactions;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled: !!asset.assetId && !!assetTransactionsRepo,
      },
    ],
  }) as [
    UseQueryResult<VenueFilteringDetails, Error>,
    UseQueryResult<AssetTransaction[], Error>,
  ];

  const [venueFilteringQuery, transactionsQuery] = results;

  return {
    transactions: {
      data: transactionsQuery.data,
      isLoading: transactionsQuery.isLoading,
      error: transactionsQuery.error,
    },
    venueFiltering: {
      data: venueFilteringQuery.data,
      isLoading: venueFilteringQuery.isLoading,
      error: venueFilteringQuery.error,
    },
    isLoading: venueFilteringQuery.isLoading || transactionsQuery.isLoading,
    error: venueFilteringQuery.error || transactionsQuery.error || null,
    paginationController,
  };
};
