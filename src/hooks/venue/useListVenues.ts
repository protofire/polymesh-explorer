import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VenueGraphRepo } from '@/services/repositories/VenueGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Venue } from '@/domain/entities/Venue';

interface VenueListResponse {
  venues: Venue[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string;
}

interface UseListVenuesParams {
  pageSize: number;
  cursor?: string;
}

export function useListVenues({
  pageSize,
  cursor,
}: UseListVenuesParams): UseQueryResult<VenueListResponse, Error> {
  const { graphQlClient } = usePolymeshSdkService();
  const venueService = useMemo(() => {
    if (!graphQlClient) return null;

    return new VenueGraphRepo(graphQlClient);
  }, [graphQlClient]);

  return useQuery<
    VenueListResponse,
    Error,
    VenueListResponse,
    [string, number, string | undefined]
  >({
    queryKey: ['venues', pageSize, cursor],
    queryFn: async () => {
      if (!venueService) throw new Error('Venue service not initialized');

      return venueService.getVenueList(pageSize, cursor);
    },
  });
}
