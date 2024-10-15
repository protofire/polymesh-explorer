import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { VenueGraphRepo } from '@/services/repositories/VenueGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Venue } from '@/domain/entities/Venue';
import { customReportError } from '@/utils/customReportError';
import { usePaginationControllerGraphQl } from '@/hooks/usePaginationControllerGraphQl';
import { PaginatedData } from '@/domain/ui/PaginationInfo';

export type UseListVenuesReturn = PaginatedData<Venue[]>;

export function useListVenues(): UseQueryResult<UseListVenuesReturn> {
  const { graphQlClient } = usePolymeshSdkService();
  const venueService = useMemo(() => {
    if (!graphQlClient) return null;
    return new VenueGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const paginationController = usePaginationControllerGraphQl();

  const fetchVenues = useCallback(async () => {
    if (!venueService) {
      throw new Error('VenueService is not initialized');
    }

    try {
      const result = await venueService.getVenueList(
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

      return result.venues;
    } catch (e) {
      customReportError(e);
      throw e;
    }
  }, [venueService, paginationController]);

  return useQuery<Venue[], Error, UseListVenuesReturn>({
    queryKey: [
      'useListVenues',
      graphQlClient,
      paginationController.paginationInfo.pageSize,
      paginationController.paginationInfo.cursor,
    ],
    queryFn: fetchVenues,
    select: useCallback(
      (data: Venue[]) => ({
        data,
        paginationController,
      }),
      [paginationController],
    ),
    enabled: !!graphQlClient && !!venueService,
  });
}
