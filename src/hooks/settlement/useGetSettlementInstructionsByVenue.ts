import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { SettlementInstructionWithAssets } from '@/domain/entities/SettlementInstruction';
import { PaginatedData } from '@/domain/ui/PaginationInfo';
import { InstructionGraphRepo } from '@/services/repositories/InstructionGraphRepo';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';

interface UseGetSettlementInstructionsByVenueParams {
  venueId?: string;
}

interface StatusQuery {
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export type UseGetSettlementInstructionsByVenueReturn = {
  historicalInstuctions: PaginatedData<
    SettlementInstructionWithAssets | undefined
  > &
    StatusQuery;
  activeInstructions: PaginatedData<
    SettlementInstructionWithAssets | undefined
  > &
    StatusQuery;
};

export const useGetSettlementInstructionsByVenue = ({
  venueId,
}: UseGetSettlementInstructionsByVenueParams): UseGetSettlementInstructionsByVenueReturn => {
  const { graphQlClient } = usePolymeshSdkService();

  const instructionRepo = useMemo(() => {
    if (!graphQlClient) return null;
    return new InstructionGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const historicalPaginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

  const activePaginationController = usePaginationControllerGraphQl({
    useOffset: true,
  });

  const enabled = !!graphQlClient && !!instructionRepo && !!venueId;

  const queries = useQueries({
    queries: [
      {
        queryKey: [
          'historicalSettlementInstructionsByVenue',
          venueId,
          historicalPaginationController.paginationInfo.pageSize,
          historicalPaginationController.paginationInfo.offset,
          true,
        ],
        queryFn: async () => {
          if (!instructionRepo || !venueId) {
            throw new Error(
              'InstructionRepo is not initialized or venueId is missing',
            );
          }

          try {
            const result = await instructionRepo.findByVenueId(
              venueId,
              historicalPaginationController.paginationInfo.pageSize,
              historicalPaginationController.paginationInfo.offset,
              true,
            );

            historicalPaginationController.setPageInfo({
              hasNextPage: result.pageInfo.hasNextPage,
              hasPreviousPage: result.pageInfo.hasPreviousPage,
              startCursor: result.pageInfo.startCursor,
              endCursor: result.pageInfo.endCursor,
              totalCount: result.totalCount,
            });

            return result;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled,
      },
      {
        queryKey: [
          'activeSettlementInstructionsByVenue',
          venueId,
          activePaginationController.paginationInfo.pageSize,
          activePaginationController.paginationInfo.offset,
          false,
        ],
        queryFn: async () => {
          if (!instructionRepo || !venueId) {
            throw new Error(
              'InstructionRepo is not initialized or venueId is missing',
            );
          }

          try {
            const result = await instructionRepo.findByVenueId(
              venueId,
              activePaginationController.paginationInfo.pageSize,
              activePaginationController.paginationInfo.offset,
              false,
            );

            activePaginationController.setPageInfo({
              hasNextPage: result.pageInfo.hasNextPage,
              hasPreviousPage: result.pageInfo.hasPreviousPage,
              startCursor: result.pageInfo.startCursor,
              endCursor: result.pageInfo.endCursor,
              totalCount: result.totalCount,
            });

            return result;
          } catch (error) {
            customReportError(error);
            throw error;
          }
        },
        enabled,
      },
    ],
  });

  const [historicalQuery, activeQuery] = queries;

  return {
    historicalInstuctions: {
      data: historicalQuery.data,
      paginationController: historicalPaginationController,
      isLoading: historicalQuery.isLoading,
      isFetched: historicalQuery.isFetched,
      error: historicalQuery.error,
    },
    activeInstructions: {
      data: activeQuery.data,
      paginationController: activePaginationController,
      isLoading: activeQuery.isLoading,
      isFetched: activeQuery.isFetched,
      error: activeQuery.error,
    },
  };
};
