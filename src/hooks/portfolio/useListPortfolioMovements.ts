import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import {
  PortfolioMovementsGraphRepo,
  PortfolioMovementType,
} from '@/services/repositories/PortfolioMovementsGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { PortfolioMovement } from '@/domain/entities/PortfolioMovement';

export type UseListPortfolioMovementsReturn = PaginatedData<
  PortfolioMovement[]
>;

interface UseListPortfolioMovementsParams {
  portfolioNumber: string;
  type: PortfolioMovementType;
}

export function useListPortfolioMovements({
  portfolioNumber,
  type,
}: UseListPortfolioMovementsParams): UseQueryResult<UseListPortfolioMovementsReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const portfolioMovementsRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new PortfolioMovementsGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

  const fetchPortfolioMovements = useCallback(async () => {
    if (!portfolioMovementsRepo) {
      throw new Error('PortfolioMovementsRepo is not initialized');
    }

    try {
      const result = await portfolioMovementsRepo.getPortfolioMovements(
        paginationController.paginationInfo.pageSize,
        portfolioNumber,
        type,
        paginationController.paginationInfo.offset,
      );

      paginationController.setPageInfo({
        hasNextPage: result.pageInfo.hasNextPage,
        hasPreviousPage: result.pageInfo.hasPreviousPage,
        startCursor: result.pageInfo.startCursor,
        endCursor: result.pageInfo.endCursor,
        totalCount: result.totalCount,
      });

      return result.movements;
    } catch (e) {
      customReportError(e);
      throw e;
    }
  }, [portfolioMovementsRepo, paginationController, portfolioNumber, type]);

  return useQuery<PortfolioMovement[], Error, UseListPortfolioMovementsReturn>({
    queryKey: [
      'useListPortfolioMovements',
      graphQlClient,
      portfolioNumber,
      type,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.offset,
    ],
    queryFn: fetchPortfolioMovements,
    select: useCallback(
      (data: PortfolioMovement[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!portfolioMovementsRepo && !!portfolioNumber,
  });
}
