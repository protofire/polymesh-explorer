import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';
import { AssetTransactionGraphRepo } from '@/services/repositories/AssetTransactionGraphRepo';

export type UseListPortfolioAssetsTransactionsReturn = PaginatedData<
  AssetTransaction[]
>;

interface UseListPortfolioAssetsTransactionsParams {
  portfolioId: Portfolio['id'] | null;
  portfolios: Portfolio[];
  nonFungible: boolean;
}

export function useListPortfolioAssetsTransactions({
  portfolioId,
  portfolios,
  nonFungible,
}: UseListPortfolioAssetsTransactionsParams): UseQueryResult<UseListPortfolioAssetsTransactionsReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const assetTransactionsRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new AssetTransactionGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl();

  const portfoliosMap = useMemo(() => {
    return portfolios.reduce(
      (acc, portfolio) => {
        acc[portfolio.id] = {
          id: portfolio.id,
          name: portfolio.name,
          number: portfolio.number,
        };
        return acc;
      },
      {} as Record<string, Portfolio>,
    );
  }, [portfolios]);

  const fetchAssetTransactions = useCallback(async () => {
    if (!assetTransactionsRepo || !portfolioId) {
      throw new Error(
        'PortfolioMovementsRepo is not initialized or portfolioId is null',
      );
    }

    try {
      const result = await assetTransactionsRepo.getAssetTransactions(
        { portfolioId },
        paginationController.paginationInfo.pageSize,
        paginationController.paginationInfo.cursor || undefined,
        nonFungible,
      );

      paginationController.setPageInfo({
        hasNextPage: result.pageInfo.hasNextPage,
        hasPreviousPage: result.pageInfo.hasPreviousPage,
        startCursor: result.pageInfo.startCursor,
        endCursor: result.pageInfo.endCursor,
        totalCount: result.totalCount,
      });

      return result.transactions.map((t) => ({
        ...t,
        from: portfoliosMap[t.fromId],
        to: portfoliosMap[t.toId],
      }));
    } catch (e) {
      customReportError(e);
      throw e;
    }
  }, [
    assetTransactionsRepo,
    portfolioId,
    paginationController,
    nonFungible,
    portfoliosMap,
  ]);

  return useQuery<
    AssetTransaction[],
    Error,
    UseListPortfolioAssetsTransactionsReturn
  >({
    queryKey: [
      'useListAssetTransactions',
      graphQlClient,
      portfolioId,
      nonFungible,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchAssetTransactions,
    select: useCallback(
      (data: AssetTransaction[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!assetTransactionsRepo && !!portfolioId,
  });
}
