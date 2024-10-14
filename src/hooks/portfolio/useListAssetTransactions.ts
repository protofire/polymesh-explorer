import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { PortfolioMovementsGraphRepo } from '@/services/repositories/PortfolioMovementsGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { PaginatedData } from '@/types/pagination';
import { calculatePaginationInfo } from '@/utils/paginationUtils';
import { customReportError } from '@/utils/customReportError';
import { Portfolio } from '@/domain/entities/Portfolio';
import { AssetTransaction } from '@/domain/entities/AssetTransaction';

interface UseListAssetTransactionsParams {
  pageSize: number;
  portfolioId: Portfolio['id'] | null;
  portfolios: Portfolio[];
  offset: number;
  currentStartIndex: number;
  nonFungible: boolean;
}

export function useListAssetTransactions({
  pageSize,
  portfolioId,
  portfolios,
  offset,
  currentStartIndex,
  nonFungible,
}: UseListAssetTransactionsParams): UseQueryResult<
  PaginatedData<AssetTransaction>,
  Error
> {
  const { graphQlClient } = usePolymeshSdkService();
  const portfolioMovementsRepo = new PortfolioMovementsGraphRepo(graphQlClient);
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

  return useQuery<PaginatedData<AssetTransaction>, Error>({
    queryKey: [
      'assetTransactions',
      pageSize,
      portfolioId,
      offset,
      currentStartIndex,
      nonFungible,
    ],
    queryFn: async () => {
      try {
        const result = await portfolioMovementsRepo.getAssetTransactions(
          portfolioId as string,
          pageSize,
          offset,
          nonFungible,
        );

        const paginationInfo = calculatePaginationInfo({
          totalCount: result.totalCount,
          pageSize,
          hasNextPage: result.hasNextPage,
          endCursor: result.endCursor,
          currentStartIndex,
        });

        return {
          data: result.transactions.map((t) => ({
            ...t,
            from: portfoliosMap[t.fromId],
            to: portfoliosMap[t.toId],
          })),
          paginationInfo,
        };
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!graphQlClient && !!portfolioId,
  });
}
