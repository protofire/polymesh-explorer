import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { VenueGraphRepo } from '@/services/repositories/VenueGraphRepo';
import { usePolymeshSdkService } from '@/context/PolymeshSdkProvider/usePolymeshSdkProvider';
import { Venue } from '@/domain/entities/Venue';

export interface UseGetVenueReturn {
  venue: Venue | null | undefined;
  isLoading: boolean;
  isFetched: boolean;
  error: Error | null;
}

export function useGetVenue(venueId: string): UseGetVenueReturn {
  const { graphQlClient } = usePolymeshSdkService();
  const venueService = useMemo(() => {
    if (!graphQlClient) return null;

    return new VenueGraphRepo(graphQlClient);
  }, [graphQlClient]);

  const query = useQuery({
    queryKey: ['venue', graphQlClient, venueId],
    queryFn: async () => {
      if (!venueService) throw new Error('Venue service not initialized');
      return venueService.findById(venueId);
    },
    enabled: !!venueService && !!venueId,
  });

  return {
    venue: query.data,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error,
  };
}
