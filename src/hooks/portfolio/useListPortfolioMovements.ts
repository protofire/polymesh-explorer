import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { PortfolioMovementsGraphRepo, PortfolioMovementType } from '@/services/repositories/PortfolioMovementsGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { PaginatedData } from '@/types/pagination';
import { calculatePaginationInfo } from '@/utils/paginationUtils';
import { customReportError } from '@/utils/customReportError';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';

interface UseListPortfolioMovementsParams {
  pageSize: number;
  portfolioNumber: string;
  type: PortfolioMovementType;
  offset: number;
  currentStartIndex: number;
}

export function useListPortfolioMovements({
  pageSize,
  portfolioNumber,
  type,
  offset,
  currentStartIndex,
}: UseListPortfolioMovementsParams): UseQueryResult<
  PaginatedData<PortfolioMovement>,
  Error
> {
  const { graphQlClient } = usePolymeshSdkService();
  const portfolioMovementsRepo = new PortfolioMovementsGraphRepo(graphQlClient);

  return useQuery<PaginatedData<PortfolioMovement>, Error>({
    queryKey: [
      'portfolioMovements',
      pageSize,
      portfolioNumber,
      type,
      offset,
      currentStartIndex,
    ],
    queryFn: async () => {
      try {
        const result = await portfolioMovementsRepo.getPortfolioMovements(
          pageSize,
          portfolioNumber,
          type,
          offset,
        );

        const paginationInfo = calculatePaginationInfo({
          totalCount: result.totalCount,
          pageSize,
          hasNextPage: result.hasNextPage,
          endCursor: result.endCursor,
          currentStartIndex,
        });

        return {
          data: result.movements,
          paginationInfo,
        };
      } catch (error) {
        customReportError(error);
        throw error;
      }
    },
    enabled: !!graphQlClient || !!portfolioNumber,
  });
}
