import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { PortfolioMovementsGraphRepo } from '@/services/repositories/PortfolioMovementsGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';

export type UseListAssetTransactionsReturn = PaginatedData<AssetTransaction[]>;

interface UseListAssetTransactionsParams {
  portfolioId: Portfolio['id'] | null;
  portfolios: Portfolio[];
  nonFungible: boolean;
}

export function useListAssetTransactions({
  portfolioId,
  portfolios,
  nonFungible,
}: UseListAssetTransactionsParams): UseQueryResult<UseListAssetTransactionsReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const portfolioMovementsRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new PortfolioMovementsGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

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
    if (!portfolioMovementsRepo || !portfolioId) {
      throw new Error(
        'PortfolioMovementsRepo is not initialized or portfolioId is null',
      );
    }

    try {
      const result = await portfolioMovementsRepo.getAssetTransactions(
        portfolioId,
        paginationController.paginationInfo.pageSize,
        nonFungible,
        paginationController.paginationInfo.offset,
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
    portfolioMovementsRepo,
    portfolioId,
    paginationController,
    nonFungible,
    portfoliosMap,
  ]);

  return useQuery<AssetTransaction[], Error, UseListAssetTransactionsReturn>({
    queryKey: [
      'useListAssetTransactions',
      graphQlClient,
      portfolioId,
      nonFungible,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.offset,
    ],
    queryFn: fetchAssetTransactions,
    select: useCallback(
      (data: AssetTransaction[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!portfolioMovementsRepo && !!portfolioId,
  });
}
